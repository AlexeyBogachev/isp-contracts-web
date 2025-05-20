import Header from "./header/StaffHeader";

const Layout = ({ children }) => (
  <>
    <Header />
    <main style={{ padding: "20px" }}>
      {children}
    </main>
  </>
);

export default Layout;