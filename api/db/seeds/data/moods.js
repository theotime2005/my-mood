import { EMOTIONAL_STATES } from "../../../src/moods/constants.js";
import { USER_TYPE } from "../../../src/shared/constants.js";

async function moods(databaseBuilder, hashedPassword) {
  const employerHappy = await databaseBuilder.factory.buildUser({
    firstname: "Happy",
    lastname: "user",
    email: "happy.user@example.net",
    hashedPassword,
    userType: USER_TYPE.EMPLOYER,
  });
  const employerSad = await databaseBuilder.factory.buildUser({
    firstname: "Sad",
    lastname: "user",
    email: "sad.user@example.net",
    hashedPassword,
  });
  await databaseBuilder.factory.buildMood({ userId: employerHappy.id, emotionalState: EMOTIONAL_STATES.HAPPY, motivation: 9 });
  await databaseBuilder.factory.buildMood({ userId: employerSad.id, emotionalState: EMOTIONAL_STATES.SAD, motivation: 3 });
}

export { moods };
