# Blog with Comment

## Comprimises

- Styling in tailwind ?
- Implicit any all over the place
- UI not polished
- Posts are not in rich text
- Error handling
- Input validation
- Can't change the slug because slug is being used as an ID
- In production, I would've used a didicated server to abstract the API implementation from the client.
- Post and comments aren't paginated
- Entire content of post is stored in every version. Maybe a more effecient approach would be to only store the deltas between the versions. (like git)
- Didn't explore storing full Range object in DB.
- Medium parses the post and stores it as multiple paragraphs with IDs
- User can only highlight one quote at a time
- env vars are visible client side

## Decesions

- Comments are client rendered
-

## Resources

- https://javascript.plainenglish.io/medium-like-text-highlighting-in-react-afa35a29a81a
