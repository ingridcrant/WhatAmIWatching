/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createMovie = /* GraphQL */ `
  mutation CreateMovie(
    $input: CreateMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    createMovie(input: $input, condition: $condition) {
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
export const updateMovie = /* GraphQL */ `
  mutation UpdateMovie(
    $input: UpdateMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    updateMovie(input: $input, condition: $condition) {
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
export const deleteMovie = /* GraphQL */ `
  mutation DeleteMovie(
    $input: DeleteMovieInput!
    $condition: ModelMovieConditionInput
  ) {
    deleteMovie(input: $input, condition: $condition) {
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
