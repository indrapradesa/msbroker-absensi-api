// export const queryAbsensi =
// `INSERT INTO absence_attendances
// (branch_company_id,nip,tgl,jam,status) VALUES ?`;
export const queryAbsensi = `
INSERT INTO absence_attendances
(branch_company_id, nip, tgl, jam, status)
VALUES ?
`;