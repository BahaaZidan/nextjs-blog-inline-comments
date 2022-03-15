import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ErrorPage from "next/error";
import Head from "next/head";
import Link from "next/link";
import { fromRange, toRange } from "xpath-range";

import {
  addComment,
  addResponse,
  getComments,
  getPost,
} from "../../../lib/http/posts";
import Container from "../../../components/atoms/Container/container";
import CommentForm from "../../../components/molecules/CommentForm/CommentForm";
import Comment from "../../../components/molecules/Comment/Comment";
import HighlightPop from "../../../components/atoms/HighlightPop/HighlightPop";
import { unwrap } from "../../../lib/dom";

export default function PostPage({ post }) {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [quoteRange, setQuoteRange] = useState<Range>();
  const [currentMarkElement, setCurrentMarkElement] = useState<HTMLElement>();

  const handleHighlightClick = () => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    setQuoteRange(range);

    document.getElementById("comments-section").scrollIntoView();
  };

  const populateComments = async () => {
    setComments(await getComments(post.slug));
  };

  const handleFormSubmit = async (commentText: string) => {
    if (quoteRange) {
      const xpathObject = fromRange(quoteRange);

      await addResponse(
        post.slug,
        post.versionId,
        xpathObject.startOffset,
        xpathObject.endOffset,
        commentText,
        quoteRange.toString(),
        xpathObject.start,
        xpathObject.end
      );
    } else {
      await addComment(post.slug, commentText);
    }
    populateComments();
    clearQuote();
  };

  const clearQuote = () => {
    setQuoteRange(undefined);
  };

  const handleQuoteClick = (quote) => {
    unwrap(currentMarkElement);
    try {
      const range = toRange(
        quote.startXpath,
        quote.startOffset,
        quote.endXpath,
        quote.endOffset,
        document
      );

      const markElement = document.createElement("mark");
      markElement.style.backgroundColor = "rgba(52, 211, 153, 1)";

      range.surroundContents(markElement);
      markElement.scrollIntoView();

      setCurrentMarkElement(markElement);
    } catch (e) {
      // TODO: handle error
      console.error(e);
    }
  };

  useEffect(() => {
    populateComments();
  }, []);

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Container>
      <Head>
        <title>{post.title} | My awesome blog</title>
      </Head>

      {router.isFallback ? (
        <div>Loading…</div>
      ) : (
        <div>
          <article>
            <header>
              <h1 className="text-4xl font-bold">{post.title}</h1>
              <time className="flex mt-2 text-gray-400">{post.date}</time>
              <Link as={`/posts/${post.slug}/edit`} href="/posts/[slug]/edit">
                <a className="text-lg leading-6 font-bold">Edit post</a>
              </Link>
            </header>

            <HighlightPop
              popoverItems={(className) => (
                <button
                  className={`${className}`}
                  onClick={handleHighlightClick}
                >
                  Quote
                </button>
              )}
            >
              <pre
                className="prose mt-10"
                style={{ whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </HighlightPop>
          </article>

          <div className="mt-20" id="comments-section">
            {quoteRange && (
              <div className="flex justify-between">
                <cite className="bg-green-400">{quoteRange.toString()}</cite>
                <button onClick={clearQuote}>Clear</button>
              </div>
            )}
            <CommentForm postSlug={post.slug} onSubmit={handleFormSubmit} />
            <div className="space-y-6 mt-10">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  currentPostVersionId={post.versionId}
                  onQuoteClick={handleQuoteClick}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export async function getServerSideProps(context) {
  return {
    props: { post: await getPost(context.params.slug) },
  };
}
