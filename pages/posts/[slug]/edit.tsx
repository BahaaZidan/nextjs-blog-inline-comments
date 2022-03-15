import { useRouter } from "next/router";
import PostForm from "../../../components/templates/PostForm/PostForm";
import { editPost, getPost } from "../../../lib/http/posts";

function EditPostPage(props) {
  const router = useRouter();
  const slug = router.query.slug;

  return (
    <PostForm
      onPublishClick={({ title, content }) => {
        editPost(`${slug}`, { title, content }).finally(() => {
          router.push(`/posts/${slug}`);
        });
      }}
      defaultValues={{ title: props.post.title, content: props.post.content }}
    />
  );
}

export default EditPostPage;

export async function getServerSideProps(context) {
  return {
    props: { post: await getPost(context.params.slug) },
  };
}
