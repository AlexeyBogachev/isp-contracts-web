import Header from "./header/Header";

const Layout = ({ children }) => (
  <>
    <Header />
    <main style={{ padding: "20px" }}>
      {children}
    </main>
  </>
);

export default Layout;