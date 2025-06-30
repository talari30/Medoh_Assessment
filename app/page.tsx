'use client';
import React, { useState } from 'react';
import Papa from 'papaparse';
import styles from './DoctorInvite.module.css';

//To check the format of the number entered
const isValidPhoneNumber = (phone: string): boolean => {
  const regex = /^\+\d{1,3}\s\d{10}$/;
  return regex.test(phone);
};

type CsvRow = { phoneNumber: string };
type SendLinkResponse = { success: boolean; link?: string; error?: string };
type BulkResult = { phoneNumber: string; success: boolean; link?: string; error?: string };

export default function DoctorInvite() {
  const [doctorName, setDoctorName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<SendLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState<CsvRow[]>([]);
  const [bulkResults, setBulkResults] = useState<BulkResult[]>([]);

  //For a single phone number
  const handleSingleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!isValidPhoneNumber(phoneNumber)) {
      setResult({ success: false, error: 'Invalid phone number format. Use +<Country Code> <10 digits>' });
      return;
    }
    setLoading(true);
    const res = await fetch('/api/send-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ doctorName, phoneNumber }),
    });
    const data = await res.json();
    setLoading(false);
    setResult(data);
  };

  //CSV parser
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => setCsvData(results.data),
    });
  };

  //For a CSV File
  const handleBulkSend = async () => {
    setLoading(true);
    const results: BulkResult[] = [];
    for (const row of csvData) {
      if (!isValidPhoneNumber(row.phoneNumber)) {
        results.push({ phoneNumber: row.phoneNumber, success: false, error: 'Invalid format' });
        continue;
      }
      try {
        const res = await fetch('/api/send-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doctorName, phoneNumber: row.phoneNumber }),
        });
        const data: SendLinkResponse = await res.json();
        results.push({ phoneNumber: row.phoneNumber, success: data.success, link: data.link, error: data.error });
      } catch {
        results.push({ phoneNumber: row.phoneNumber, success: false, error: 'Network error' });
      }
    }
    setBulkResults(results);
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Medoh Doctor Invite Tool</h1>

      <form onSubmit={handleSingleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Doctor Name:</label>
          <input className={styles.input} value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Phone Number:</label>
          <input className={styles.input} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
        </div>

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Sending...' : 'Send Single Invite'}
        </button>
      </form>

      {loading && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderSpinner}></div>
          <p>Sending, please wait...</p>
        </div>
      )}
      {result?.success && <div className={styles.successMessage}>✅ Link Sent: {result.link}</div>}
      {result?.error && <div className={styles.errorMessage}>❌ Error: {result.error}</div>}

      <div className={styles.bulkSection}>
        <h3 className={styles.bulkHeading}>Bulk Upload via CSV</h3>
        <p className={styles.bulkInfo}>CSV file should have column: <code>phoneNumber</code></p>
        <input type="file" accept=".csv" onChange={handleCSVUpload} className="mb-4" />

        {csvData.length > 0 && (
          <div>
            <p className={styles.csvLoaded}>✅ {csvData.length} phone numbers loaded.</p>
            <button onClick={handleBulkSend} disabled={loading} className={styles.button}>
              {loading ? 'Sending Bulk...' : 'Send Bulk Invites'}
            </button>
          </div>
        )}

        {bulkResults.length > 0 && (
          <div className={styles.bulkResults}>
            <h4 className={styles.bulkHeading}>Bulk Results:</h4>
            <ul className={styles.resultList}>
              {bulkResults.map((result, index) => (
                <li key={index} className={styles.resultItem}>
                  <p><strong>Phone:</strong> {result.phoneNumber}</p>
                  {result.success ? (
                    <p className={styles.resultSuccess}>✅ Link Sent: {result.link}</p>
                  ) : (
                    <p className={styles.resultError}>❌ Error: {result.error}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
