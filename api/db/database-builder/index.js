import { buildMood } from "./factory/build-mood.js";
import { buildUser } from "./factory/build-user.js";

const databaseBuilder = {
  factory: {
    buildUser,
    buildMood,
  },
};
export default databaseBuilder;
