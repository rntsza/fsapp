const useRouter = jest.fn(() => ({
  push: jest.fn(),
  prefetch: jest.fn(),
  route: "/",
  pathname: "",
  query: "",
  asPath: "",
}));

module.exports = {
  useRouter,
};
