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