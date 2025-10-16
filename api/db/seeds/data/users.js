import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";
import { USER_TYPE } from "../../../src/shared/constants.js";

const password = await generatePassword("mymood123");
async function users(databaseBuilder) {
  const employer = {
    firstname: "user",
    lastname: "employer",
    email: "user.employer@example.net",
    hashedPassword: password,
    userType: USER_TYPE.EMPLOYER,
    isActive: true,
    shouldChangePassword: false,
  };

  const manager = {
    firstname: "user",
    lastname: "manager",
    email: "user.manager@example.net",
    hashedPassword: password,
    userType: USER_TYPE.MANAGER,
    isActive: true,
    shouldChangePassword: false,
  };

  const employerMustChangePassword = {
    firstname: "user",
    lastname: "employer-must-change-password",
    email: "user.employer-must-change-password@example.net",
    hashedPassword: password,
    userType: USER_TYPE.EMPLOYER,
    isActive: false,
    shouldChangePassword: true,
  };

  const admin = {
    firstname: "user",
    lastname: "admin",
    email: "user.admin@example.net",
    hashedPassword: password,
    userType: USER_TYPE.ADMIN,
  };

  // call database builder with data
  await databaseBuilder.factory.buildUser(employer);
  await databaseBuilder.factory.buildUser(manager);
  await databaseBuilder.factory.buildUser(employerMustChangePassword);
  await databaseBuilder.factory.buildUser(admin);
}

export { users };
