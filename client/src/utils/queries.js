import { gql } from "@apollo/client";
// Definy querys based on the server's typedefs queries
export const QUERY_GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        authors
        description
        image
        link
        title
      }
    }
  }
`;
