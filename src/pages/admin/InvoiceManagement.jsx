import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import {
  Topbar,
  Loading
} from '../../components';

import {
  getAgents,
  uploadInvoice,
  getInvoices
} from '../../services/api';

import toast from 'react-hot-toast';

export default function InvoiceManagement() {
    const [agents, setAgents] = useState([]);
const [invoices, setInvoices] = useState([]);

const [loading, setLoading] = useState(false);

const [agent, setAgent] = useState('');
const [month, setMonth] = useState('');
const [amount, setAmount] = useState('');

const [pdf, setPdf] = useState(null);


useEffect(() => {

    loadAgents();

    loadInvoices();

}, []);


const loadAgents = async () => {

    try {

        const res = await getAgents();

        setAgents(res.data.data || []);

    }

    catch (err) {

        console.log(err);

    }

};

const loadInvoices = async () => {

    try {

        const res = await getInvoices();

        setInvoices(res.data.data || []);

    }

    catch (err) {

        console.log(err);

    }

};

const handleUpload = async (e) => {

    e.preventDefault();

    if (!agent)
        return toast.error("Select Agent");

    if (!month)
        return toast.error("Select Month");

    if (!pdf)
        return toast.error("Choose PDF");

    try {

        setLoading(true);

        const formData = new FormData();

       formData.append("agent", agent);

formData.append("month", month);

formData.append("amount", amount);

formData.append("type", "monthly");

formData.append("invoice", pdf);

        await uploadInvoice(formData);

        toast.success("Invoice Uploaded Successfully");

        setAgent("");

        setMonth("");

        setAmount("");

        setPdf(null);

        loadInvoices();

    }

    catch (err) {

        toast.error(

            err.response?.data?.message ||

            "Upload Failed"

        );

    }

    finally {

        setLoading(false);

    }

};



return (
  <div className="layout">
    <AdminSidebar />

    <div className="main-content">

      <Topbar
        title="Invoice Management"
        subtitle="Upload Monthly Invoice PDF"
      />

      <div className="page-content">

        {/* Upload Card */}

        <div className="card" style={{ marginBottom: 25 }}>

          <h3 style={{ marginBottom: 20 }}>
            Upload Invoice
          </h3>

          <form onSubmit={handleUpload}>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: 15
              }}
            >

              <select
                className="form-control"
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
              >

                <option value="">
                  Select Agent
                </option>

                {agents.map((a) => (

                  <option
                    key={a._id}
                    value={a._id}
                  >

                    {a.fullName}

                  </option>

                ))}

              </select>

              <select
                className="form-control"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >

                <option value="">Select Month</option>

                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>

              </select>
            <input
  type="number"
  className="form-control"
  placeholder="Enter Amount"
  value={amount}
  onChange={(e) => setAmount(e.target.value)}
/>

              <input
                type="file"
                className="form-control"
                accept=".pdf"
                onChange={(e) =>
                  setPdf(e.target.files[0])
                }
              />

            </div>

            <button
              className="btn btn-primary"
              style={{
                marginTop: 20
              }}
              disabled={loading}
            >

              {loading
                ? "Uploading..."
                : "Upload Invoice"}

            </button>

          </form>

        </div>

        {/* Invoice List */}

        <div className="card">

          <h3 style={{ marginBottom: 20 }}>
            Uploaded Invoices
          </h3>

          {loading ? (

            <Loading />

          ) : (

            <div className="table-wrap">

              <table>

                <thead>

                  <tr>

                    <th>Agent</th>

                    <th>Month</th>

                    <th>Amount</th>

                    <th>Uploaded</th>

                    <th>Action</th>

                  </tr>

                </thead>

                <tbody>

                  {invoices.length === 0 ? (

                    <tr>

                      <td
                        colSpan="5"
                        style={{
                          textAlign: "center",
                          padding: 30
                        }}
                      >

                        No Invoice Uploaded

                      </td>

                    </tr>

                  ) : (

                    invoices.map((invoice) => (

                      <tr
                        key={invoice._id}
                      >

                        <td>

                          {invoice.agent?.fullName}

                        </td>

                        <td>

                          {invoice.month}

                        </td>

                        <td>

                          ₹{invoice.amount}

                        </td>

                        <td>

                          {new Date(
                            invoice.createdAt
                          ).toLocaleDateString()}

                        </td>

                        <td>

                          <a
                            href={invoice.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-outline btn-sm"
                          >

                            View PDF

                          </a>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>

  </div>
);
  
}