import Header from "./header/ClientHeader";

const Layout = ({ children }) => (
  <>
    <Header />
    <main style={{
      minHeight: "calc(100vh - 64px)" // Полная высота экрана минус высота шапки
    }}>
      {children}
    </main>
  </>
);

export default Layout;