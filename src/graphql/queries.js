/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getMovie = /* GraphQL */ `
  query GetMovie($id: ID!) {
    getMovie(id: $id) {
      id
      title
      overview
      poster_path
      watch_status
      vote_average
      movie_id
      createdAt
      updatedAt
      owner
    }
  }
`;
export const listMovies = /* GraphQL */ `
  query ListMovies(
    $filter: ModelMovieFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMovies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        overview
        poster_path
        watch_status
        vote_average
        movie_id
        createdAt
        updatedAt
        owner
      }
      nextToken
    }
  }
`;
