import React, { useEffect, useState } from "react";
import AgentSidebar from "../../components/AgentSidebar";
import { Topbar, Loading } from "../../components";
import { getMyInvoices } from "../../services/api";
import toast from "react-hot-toast";

export default function Invoices() {

  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {

    try {

      const res = await getMyInvoices();

      setInvoices(res.data.data || []);

    } catch (err) {

      toast.error("Unable to load invoices");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="layout">

      <AgentSidebar />

      <div className="main-content">

        <Topbar
          title="My Invoices"
          subtitle="Invoices uploaded by Admin"
        />

        <div className="page-content">

          <div className="card">

            <h3 style={{ marginBottom: 20 }}>
              Monthly Invoices
            </h3>

            {loading ? (

              <Loading />

            ) : (

              <div className="table-wrap">

                <table>

                  <thead>

                    <tr>

                      <th>Month</th>

                      <th>Amount</th>

                      <th>Type</th>

                      <th>Status</th>

                      <th>Date</th>

                      <th>PDF</th>

                    </tr>

                  </thead>

                  <tbody>

                    {invoices.length === 0 ? (

                      <tr>

                        <td
                          colSpan="6"
                          style={{
                            textAlign: "center",
                            padding: 30
                          }}
                        >
                          No invoices available.
                        </td>

                      </tr>

                    ) : (

                      invoices.map((invoice) => (

                        <tr key={invoice._id}>

                          <td>{invoice.month}</td>

                          <td>
                            ₹ {invoice.amount}
                          </td>

                          <td>
                            {invoice.type}
                          </td>

                          <td>
                            {invoice.status}
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
                              className="btn btn-primary btn-sm"
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