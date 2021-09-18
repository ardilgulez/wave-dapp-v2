import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import "./NavBar.css";

const NavBar = ({ account, connectWallet }) => {
    console.log(account);
    return (
        <Navbar bg="dark" variant="dark">
            <Container>
                <Navbar.Brand className="navbar-text" href="#">
                    Wave at Kemal!
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text className="navbar-text">
                        {account != null && account.length > 0 ? (
                            `Connected: ${account}`
                        ) : (
                            <Button variant="light" onClick={connectWallet}>
                                Connect Metamask
                            </Button>
                        )}
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
