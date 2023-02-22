module.exports = {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["generated_file_samples"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
