import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
};

export const comparePass = (plain, hash) => bcrypt.compareSync(plain, hash);
