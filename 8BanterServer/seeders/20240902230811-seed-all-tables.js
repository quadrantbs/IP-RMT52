"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          username: "User",
          email: "user@mail.com",
          password: bcrypt.hashSync("123456", 10),
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: "Admin",
          email: "admin@mail.com",
          password: bcrypt.hashSync("123456", 10),
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Memes",
      [
        {
          title: "Funny Cat",
          imageUrl:
            "https://api.memegen.link/images/grumpycat/i_hope_that_what_does_not_kill_you/tries_again.png",
          likes: 1,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Bro drink too much",
          imageUrl:
            "https://api.memegen.link/images/drunk/Walk_in_a_straight_line~q/Officer,_I_can_barely_stand.png",
          likes: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Tags",
      [
        {
          name: "funny",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "meme",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "MemeTags",
      [
        {
          memeId: 1,
          tagId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          memeId: 1,
          tagId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          memeId: 2,
          tagId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Comments",
      [
        {
          text: "This is hilarious!",
          memeId: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: "I cant stand this meme too!",
          memeId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "Likes",
      [
        {
          memeId: 1,
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          memeId: 2,
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Memes", null, {});
    await queryInterface.bulkDelete("Tags", null, {});
    await queryInterface.bulkDelete("MemeTags", null, {});
    await queryInterface.bulkDelete("Comments", null, {});
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
