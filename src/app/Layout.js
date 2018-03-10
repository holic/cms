import React from "react";
import DocumentTitle from "react-document-title";
import Nav from "./Nav";

export default function Layout({ children }) {
  return (
    <DocumentTitle title="CMS">
      <div className="row no-gutters minh-100">
        <div className="col-sm-4 col-md-3 col-xl-2 bg-light">
          <div className="p-4">
            <Nav />
          </div>
        </div>
        <div className="col">
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </DocumentTitle>
  );
}
