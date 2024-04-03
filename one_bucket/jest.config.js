module.exports = {
  preset: 'react-native',
  setupFiles: ["./jest/setup.js"],
  moduleNameMapper: {
    "\\.(png|jpg|ico|jpeg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
    "<rootDir>/src/__mocks__/ImageMock.js",
  },
};
