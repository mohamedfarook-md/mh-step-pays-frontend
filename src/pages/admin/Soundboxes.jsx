import React, { useEffect, useState } from "react";
import AgentSidebar from "../../components/AdminSidebar";
import { Topbar, Loading } from "../../components";
import API from "../../services/api";
import toast from "react-hot-toast";

export default function Soundboxes() {
  const [loading, setLoading] = useState(true);
  const [soundboxes, setSoundboxes] = useState([]);
  const [search, setSearch] = useState("");

 const [form, setForm] = useState({
  merchantName: "",
  mobile: "",
  email: "",
  shopName: "",
  shopAddress: "",
  upiId: "",
  provider: "Easebuzz",
  merchantIdentifier: "",
  providerVpa: "",
  tid: "",
  imei: "",
  barcode: ""
});

  const loadSoundboxes = async () => {
    try {
      const res = await API.get("/soundboxes");
      setSoundboxes(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load soundboxes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSoundboxes();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveSoundbox = async () => {
     console.log("FORM DATA =>", form);
    try {
      await API.post("/soundboxes", form);
      toast.success("Soundbox Added");
     setForm({
  merchantName: "",
  mobile: "",
  email: "",
  shopName: "",
  shopAddress: "",
  upiId: "",
  provider: "Easebuzz",
  merchantIdentifier: "",
  providerVpa: "",
  tid: "",
  imei: "",
  barcode: ""
});
      loadSoundboxes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="layout">

      <AgentSidebar />

      <div className="main-content">

        <Topbar
          title="Soundbox Management"
          subtitle="Manage ToneTag Soundboxes"
        />

        <div className="page-content">

          <div className="card">

            <h3>Add Soundbox</h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 15,
              }}
            >

             
            <input
  name="merchantName"
  placeholder="Merchant Name"
  value={form.merchantName}
  onChange={handleChange}
/>

<input
  name="mobile"
  placeholder="Mobile Number"
  value={form.mobile}
  onChange={handleChange}
/>

<input
  name="email"
  placeholder="Email Address"
  value={form.email}
  onChange={handleChange}
/>

<input
  name="shopName"
  placeholder="Shop Name"
  value={form.shopName}
  onChange={handleChange}
/>

<input
  name="shopAddress"
  placeholder="Shop Address"
  value={form.shopAddress}
  onChange={handleChange}
/>

<input
  name="upiId"
  placeholder="UPI ID"
  value={form.upiId}
  onChange={handleChange}
/>
<input
  name="merchantIdentifier"
  placeholder="Merchant Identifier"
  value={form.merchantIdentifier || ""}
  onChange={handleChange}
/>

<input
  name="providerVpa"
  placeholder="Provider VPA (Easebuzz VPA)"
  value={form.providerVpa}
  onChange={handleChange}
/>

<input
  name="tid"
  placeholder="TID"
  value={form.tid}
  onChange={handleChange}
/>

<input
  name="imei"
  placeholder="IMEI Number"
  value={form.imei}
  onChange={handleChange}
/>

<input
  name="barcode"
  placeholder="Barcode Number"
  value={form.barcode}
  onChange={handleChange}
/>

            </div>

            <button
              className="btn btn-primary"
              style={{ marginTop: 20 }}
              onClick={saveSoundbox}
            >
              Save Soundbox
            </button>

          </div>

          <div className="card" style={{ marginTop: 25 }}>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >

              <h3>Soundbox List</h3>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 250 }}
              />

            </div>

            <table className="table">

              <thead>

                <tr>

                 <th>Merchant</th>
<th>Mobile</th>
<th>UPI ID</th>
<th>Provider VPA</th>
<th>TID</th>
<th>Status</th>
<th>Actions</th>

                </tr>

              </thead>

              <tbody>
                                {soundboxes
                  .filter((item) => {
                    const q = search.toLowerCase();

                    return (
                      item.merchantName?.toLowerCase().includes(q) ||
                      item.tid?.toLowerCase().includes(q) ||
                      item.imei?.toLowerCase().includes(q)
                    );
                  })
                  .map((item) => (
                    <tr key={item._id}>

                     <td>
  <strong>{item.merchantName}</strong>
  <br />
  <small>{item.shopName}</small>
</td>

<td>{item.mobile}</td>

<td>{item.upiId}</td>
<td>{item.providerVpa}</td>
<td>{item.tid}</td>

                      <td>

                        <span
                          style={{
                            padding: "5px 12px",
                            borderRadius: 20,
                            color: "#fff",
                            background:
                            item.status?.toLowerCase() === "active"
                            ? "#16a34a"
                            : "#ef4444",
                          }}
                        >
                          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1).toLowerCase()}
                        </span>

                      </td>

                      <td>

                        <button
                          className="btn btn-success"
                          onClick={async () => {
                            try {
                              await API.put(
                                `/soundboxes/${item._id}/activate`
                              );

                              toast.success("Soundbox Activated");

                              loadSoundboxes();
                            } catch (err) {
                              toast.error("Activation Failed");
                            }
                          }}
                        >
                          Activate
                        </button>

                        <button
                          className="btn btn-danger"
                          style={{ marginLeft: 10 }}
                          onClick={async () => {
                            if (!window.confirm("Delete this Soundbox?"))
                              return;

                            try {
                              await API.delete(`/soundboxes/${item._id}`);

                              toast.success("Deleted");

                              loadSoundboxes();
                            } catch (err) {
                              toast.error("Delete Failed");
                            }
                          }}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}