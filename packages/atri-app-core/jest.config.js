module.exports = {
  preset: "ts-jest",
  modulePathIgnorePatterns: ["example-routes"],
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};
