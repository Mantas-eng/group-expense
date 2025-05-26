  import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
  import GroupsPage from "./pages/GroupsPage";
  import GroupDetail from "./pages/GroupDetail"; 
  import NewTransaction from "./pages/NewTransaction"; 

  function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<GroupsPage />}/>
          <Route path="/groups/:groupId" element={<GroupDetail />} />
          <Route path="/groups/:groupId/new-transaction" element={<NewTransaction />} />
        </Routes>
      </Router>
    );
  }

  export default App;