import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as bootstrap from 'bootstrap';

const API = "http://localhost:8000";

export default function TicketApp() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    title: '',
    description: '',
    ticket_type_id: '',
    project_id: '',
    assign_at: '',
  });

  const [editForm, setEditForm] = useState(null);
  const [ticketAll, setTicketAll] = useState([]);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [projects, setProjects] = useState([]);
  const [message, setMessage] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const modalRef = useRef(null);
  const editModalRef = useRef(null);
  const confirmDeleteRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get(`${API}/ticket-types`).then(res => setTicketTypes(res.data));
    axios.get(`${API}/projects`).then(res => setProjects(res.data));
    axios.get(`${API}/ticketsIndex`).then(res => setTicketAll(res.data));
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = e => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${API}/tickets`, form);
      setMessage('Ticket berhasil dikirim!');
      setForm({
        full_name: '',
        email: '',
        title: '',
        description: '',
        ticket_type_id: '',
        project_id: '',
        assign_at: '',
      });
      fetchData();
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      if (modal) modal.hide();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengirim ticket!');
    }
  };

  const openEditModal = (ticket) => {
    setEditForm({
      id: ticket.id,
      email: ticket.email,
      description: ticket.description,
      ticket_type_id: ticket.ticket_type_id,
      status: ticket.status
    });
    const modal = new bootstrap.Modal(editModalRef.current);
    modal.show();
  };

  const handleUpdate = async e => {
    e.preventDefault();
    try {
      await axios.put(`${API}/tickets/${editForm.id}`, editForm);
      setMessage('Tiket berhasil diperbarui!');
      setEditForm(null);
      fetchData();
      const modal = bootstrap.Modal.getInstance(editModalRef.current);
      modal.hide();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal mengupdate tiket!');
    }
  };

  const confirmDelete = id => {
    setDeleteId(id);
    const modal = new bootstrap.Modal(confirmDeleteRef.current);
    modal.show();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/tickets/${deleteId}`);
      setMessage('Tiket berhasil dihapus!');
      fetchData();
      setDeleteId(null);
      const modal = bootstrap.Modal.getInstance(confirmDeleteRef.current);
      modal.hide();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Gagal menghapus tiket!');
    }
  };

  const filteredTickets = ticketAll.filter(t =>
    t.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold text-dark">Tiket Bantuan App</h2>
        <button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#createModal">
          + Tambah Tiket
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Cari berdasarkan Nama atau Judul Masalah..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {message && <div className="alert alert-warning">{message}</div>}

      <div className="card shadow border-0 mb-5">
        <div className="card-header bg-warning text-white fw-bold">Daftar Tiket</div>
        <div className="card-body p-0">
          <table className="table table-hover m-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Judul</th>
                <th>Jenis</th>
                <th>Proyek</th>
                <th>Status</th>
                <th>Assign At</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length > 0 ? filteredTickets.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.full_name}</td>
                  <td>{t.email}</td>
                  <td>{t.title}</td>
                  <td>{t.ticket_type?.name}</td>
                  <td>{t.project?.name}</td>
                  <td><span className="badge bg-secondary">{t.status}</span></td>
                  <td>{t.assign_at}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <button className="btn btn-sm btn-outline-warning" onClick={() => openEditModal(t)}>Edit</button>
                      {t.status === 'cancel' && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(t.id)}>Hapus</button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-3">Tidak ada tiket ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Tiket */}
      <div className="modal fade" id="createModal" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-3">
            <form onSubmit={handleSubmit}>
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">Tambah Tiket Baru</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body bg-white">
                <div className="row g-3">
                  <div className="col-md-6">
                    <input name="full_name" className="form-control" placeholder="Nama Lengkap" value={form.full_name} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <input name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <input name="title" className="form-control" placeholder="Judul Masalah" value={form.title} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <textarea name="description" className="form-control" placeholder="Deskripsi (Opsional)" rows="3" value={form.description} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <select name="ticket_type_id" className="form-select" value={form.ticket_type_id} onChange={handleChange} required>
                      <option value="">-- Pilih Jenis Tiket --</option>
                      {ticketTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <select name="project_id" className="form-select" value={form.project_id} onChange={handleChange} required>
                      <option value="">-- Pilih Proyek --</option>
                      {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <input name="assign_at" type="date" className="form-control" value={form.assign_at} onChange={handleChange} required />
                  </div>
                </div>
              </div>
              <div className="modal-footer bg-light">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn btn-warning">Simpan Tiket</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Edit Tiket */}
      <div className="modal fade" id="editModal" tabIndex="-1" ref={editModalRef}>
        <div className="modal-dialog">
          <div className="modal-content shadow">
            <form onSubmit={handleUpdate}>
              <div className="modal-header bg-warning text-white">
                <h5 className="modal-title">Edit Tiket</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body">
                {editForm && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Email</label>
                      <input name="email" className="form-control" value={editForm.email} onChange={handleEditChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Deskripsi</label>
                      <textarea name="description" className="form-control" value={editForm.description} onChange={handleEditChange}></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Jenis Tiket</label>
                      <select name="ticket_type_id" className="form-select" value={editForm.ticket_type_id} onChange={handleEditChange}>
                        <option value="">-- Pilih Jenis --</option>
                        {ticketTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status</label>
                      <select name="status" className="form-select" value={editForm.status} onChange={handleEditChange}>
                        <option value="open">Open - Tiket baru</option>
                        <option value="progress">Progress - Ditangani</option>
                        <option value="closed">Closed - Selesai</option>
                        <option value="cancel">Cancel - Dibatalkan</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>
                <button type="submit" className="btn btn-warning">Simpan Perubahan</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Konfirmasi Delete */}
      <div className="modal fade" id="confirmDeleteModal" tabIndex="-1" ref={confirmDeleteRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">Konfirmasi Hapus</h5>
              <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Apakah kamu yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
              <button className="btn btn-warning" onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
