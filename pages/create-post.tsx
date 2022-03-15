import { useRouter } from "next/router";
import kebabCase from "lodash/kebabCase";
import { createPost } from "../lib/http/posts";
import PostForm from "../components/templates/PostForm/PostForm";

function CreatePostPage() {
  const router = useRouter();

  return (
    <PostForm
      onPublishClick={({ title, content }) => {
        createPost({ title, content, slug: kebabCase(title) }).finally(() => {
          router.push("/posts");
        });
      }}
    />
  );
}

export default CreatePostPage;
