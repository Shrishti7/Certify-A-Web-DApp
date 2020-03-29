import React, {Component} from 'react';

// const Navbar = () => {
class Navbar extends Component {
  render() {
    return (
      <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            <a
              className="navbar-brand col-sm-3 col-md-2 mr-0"
              href=""
              target="_blank"
              rel="noopener noreferrer"
            >
              Certify
            </a>
            <ul className="navbar-nav px-3">
              <li>
                  <small className="text-white">{this.props.account}</small>
              </li>
            </ul>
          </nav> <p> </p>
      </div>
    );
  }
}

export default Navbar;
