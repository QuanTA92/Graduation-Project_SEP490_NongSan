import React from "react";

const AuthContext = React.createContext();

class AuthProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountId: "",
      token: "",
    };
  }

  componentDidMount() {
    const storedAccountId = localStorage.getItem("accountId");
    const storedToken = localStorage.getItem("token");

    if (storedAccountId && storedToken) {
      this.setState({
        accountId: storedAccountId,
        token: storedToken,
      });
    }
  }

  componentDidUpdate() {
    const { accountId, token } = this.state;
    localStorage.setItem("accountId", accountId);
    localStorage.setItem("token", token);
  }

  render() {
    const { accountId, token } = this.state;
    const contextValue = {
      accountId,
      token,
      setAccountId: (newAccountId) =>
        this.setState({ accountId: newAccountId }),
      setToken: (newToken) => this.setState({ token: newToken }),
    };

    return (
      <AuthContext.Provider value={contextValue}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, useAuth, AuthContext };
