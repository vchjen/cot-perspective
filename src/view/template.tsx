import { readFileSync } from 'node:fs'
import { FC, StrictMode, useContext } from 'react'
import { DataTableCtx, DataTableProps } from './data-table'
import { HeaderCtx } from './header'
import { PageDropdownsCtx, PageDropdownsProps } from './page-dropdowns'
import { UsefulLinkCtx } from './useful-link'

const license = readFileSync('./LICENSE').toString()

interface Props {
  dropDownsData: PageDropdownsProps
  tableData: DataTableProps
}

export const Template: FC<Props> = (props) => {
  const Header = useContext(HeaderCtx)
  const UsefulLink = useContext(UsefulLinkCtx)
  const PageDropDowns = useContext(PageDropdownsCtx)
  const DataTable = useContext(DataTableCtx)

  return (
    <StrictMode>
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <link rel="icon" href="favicon.ico" type="image/x-icon" />
          <title>COT Perspective • Delightful COT Reports</title>
          <meta name='description' content='Delightful COT Reports' />
          <meta name='author' content='Hadrian de Oliveira' />
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="COT Perspective" />
          <meta property="og:title" content="COT Perspective • Delightful COT Reports" />
          <meta property="og:description" content="Delightful COT Reports" />
          <meta property="og:image" content="https://cotperspective.com/preview.png" />
          <meta property="og:url" content="https://cotperspective.com" />
          <link rel='stylesheet' href='https://bootswatch.com/4/cosmo/bootstrap.min.css' />
          <link rel='stylesheet' href='styles.css' />
        </head>
        <body>
          <div id='cotperspective' className='container'>
            <Header>
              <div className='col-4 pt-1' />
              <div className='col-4 text-center'>
                <a className='blog-header-logo text-dark' href='/'>COT Perspective</a>
              </div>
              <div className='col-4 d-flex justify-content-end align-items-center' />
            </Header>
            <PageDropDowns {...props.dropDownsData} />
            <DataTable {...props.tableData} />
            <Header>
              <div className='col-12'>
                <h3>Useful Links</h3>
              </div>
            </Header>
            <div className='row mb-2' style={{ paddingTop: 20 }}>
              <ul>
                <UsefulLink
                  link='https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm'
                  channel='CFTC'
                  title='Commitments of Traders (COT) Reports Descriptions'
                />
              </ul>
            </div>
            <div className='row mb-2' style={{ paddingTop: 20, paddingBottom: 30 }}>
              <div className='container text-justify'>
                <small>
                  {license}
                </small>
              </div>
            </div>
          </div>
        </body>
      </html>
    </StrictMode>
  )
}
