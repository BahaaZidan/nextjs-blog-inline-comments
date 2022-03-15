import Link from "next/link";

import { getPosts } from "../../lib/http/posts";

import Container from "../../components/atoms/Container/container";

export default function NotePage({ posts }) {
  return (
    <Container>
      {posts.length ? (
        posts.map((post) => (
          <article key={post.slug} className="mb-10">
            <Link as={`/posts/${post.slug}`} href="/posts/[slug]">
              <a className="text-lg leading-6 font-bold">{post.title}</a>
            </Link>
            <div className="text-gray-400">
              <time>{post.date}</time>
            </div>
          </article>
        ))
      ) : (
        <p>No blog posted yet :/</p>
      )}
    </Container>
  );
}

export async function getServerSideProps() {
  return {
    props: { posts: await getPosts() },
  };
}
