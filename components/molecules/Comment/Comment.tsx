function Comment(props: {
  comment;
  currentPostVersionId: string;
  onQuoteClick: (quote) => void;
}) {
  const { comment, currentPostVersionId, onQuoteClick } = props;

  const handleQuoteClick = (quote) => () => {
    if (quote.postVersionId === currentPostVersionId) onQuoteClick(quote);
  };

  return (
    <div key={comment.createdAt} className="flex space-x-4">
      <div className="flex-grow">
        <div className="flex space-x-2">
          <time className="text-gray-400">{comment.createdAt}</time>
        </div>
        {comment.quote && (
          <cite
            role="button"
            onClick={handleQuoteClick(comment.quote)}
            className="bg-green-400"
          >
            {comment.quote.text}
          </cite>
        )}
        <div>{comment.text}</div>
      </div>
    </div>
  );
}

export default Comment;
