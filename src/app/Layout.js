import React from 'react'
import DocumentTitle from 'react-document-title'
import Nav from './Nav'

export default function Layout ({ children }) {
  return (
    <DocumentTitle title="CMS">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-4 col-md-3 col-lg-2 p-a-2 bg-faded" style={{position: 'absolute', top: 0, left: 0, bottom: 0}}>
            <Nav />
          </div>
          <div className="offset-sm-4 offset-md-3 offset-lg-2 col-sm-8 col-md-9 col-lg-10 p-a-2">
            {children}
          </div>
        </div>
      </div>
    </DocumentTitle>
  )
}
