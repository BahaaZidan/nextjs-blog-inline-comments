import { ChangeEventHandler, useState } from "react";
import Container from "../../atoms/Container/container";

function PostForm(props: {
  onPublishClick: (post: { title: string; content: string }) => void;
  defaultValues?: { title: string; content: string };
}) {
  const [title, setTitle] = useState(props.defaultValues?.title || "");
  const [content, setContent] = useState(props.defaultValues?.content || "");

  const handleTitleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  const handlePublishClick = () => {
    props.onPublishClick({ title, content });
  };

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px 0" }}>
        <input onChange={handleTitleChange} placeholder="Title" value={title} />
        <textarea
          onChange={handleContentChange}
          placeholder="Content"
          rows={15}
          value={content}
        />
        <button onClick={handlePublishClick}>Publish</button>
      </div>
    </Container>
  );
}

export default PostForm;
