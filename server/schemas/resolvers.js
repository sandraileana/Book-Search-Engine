const { AuthenticationError } = require("apollo-server-express");
const { Book, User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      // If user exists in context, then it is logged in, if logged in, get the user info of the logged in user
      if (context.user) {
        const foundUser = await User.findOne({ _id: context.user._id });
        return foundUser;
      }
      throw new AuthenticationError("No user found");
    },
  },

  Mutation: {
    // Create a new user
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      // Send the user to the signtoken function, this will mount the user in the payload of the jwt and  return the token
      const token = signToken(user);
      return { token, user };
    },
    // Log in a user
    login: async (parent, { email, password }) => {
      // Check if email exists
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // If user exists, check if the provided password is the same as the one encripted in the database
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }
      // Send the user to the signtoken and get the jwt back
      const token = signToken(user);
      return { token, user };
    },
    // Save a new book to the logged in user's savedBook array
    saveBook: async (parent, {book}, context) => {
      console.log("Inside savebook mutation");
      if(context.user) {
        // Find the logged in user, push a new book to the savedBooks array
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: book } },
          { new: true }   
        );
        return user;
      }
      throw new AuthenticationError("Could not save the book");
    },
    // Find the logged in user and remove a book by its id
    removeBook: async (parent, { bookId }, context) => {
      console.log("Inside removebook mutation");
      if(context.user){
        const user = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return user;
      };
      throw new AuthenticationError("Could not delete the book");
    },
  },
};

module.exports = resolvers;
