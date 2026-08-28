<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
        body { font-family: 'Inter', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 560px; margin: 32px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(37,99,235,.08); }
        .header { background: #2563eb; padding: 32px 40px; text-align: center; }
        .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; }
        .header p  { color: #bfdbfe; margin: 4px 0 0; font-size: 14px; }
        .body { padding: 32px 40px; }
        .status-badge { display: inline-block; padding: 8px 20px; border-radius: 9999px; font-size: 14px; font-weight: 600; margin-bottom: 24px; }
        .approved  { background: #d1fae5; color: #065f46; }
        .revision  { background: #fee2e2; color: #991b1b; }
        .published { background: #dbeafe; color: #1e40af; }
        .card { background: #f8fafc; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
        .card label { font-size: 11px; text-transform: uppercase; letter-spacing: .05em; color: #64748b; font-weight: 600; }
        .card p { margin: 4px 0 0; font-size: 15px; color: #1e293b; font-weight: 500; }
        .notes { background: #fff7ed; border-left: 3px solid #f97316; padding: 12px 16px; border-radius: 0 8px 8px 0; margin: 20px 0; font-size: 14px; color: #7c2d12; }
        .btn { display: inline-block; background: #2563eb; color: #fff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 600; margin-top: 24px; }
        .footer { text-align: center; padding: 20px 40px; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>Saka InternHub</h1>
        <p>PT Saka Inovasi Network — Platform Portofolio Digital</p>
    </div>
    <div class="body">
        <p style="font-size:16px; color:#1e293b;">Halo, <strong>{{ $work->student->name }}</strong>!</p>
        <p style="color:#475569; font-size:14px; margin-top:4px;">Status karya Anda telah diperbarui oleh <strong>{{ $reviewer->name }}</strong>.</p>

        @php $status = $work->verification_status; @endphp

        @if($status === 'approved')
            <span class="status-badge approved">✅ Karya Disetujui</span>
        @elseif($status === 'revision')
            <span class="status-badge revision">🔄 Perlu Revisi</span>
        @elseif($status === 'published')
            <span class="status-badge published">🌐 Dipublikasikan</span>
        @endif

        <div class="card">
            <label>Karya</label>
            <p>{{ $work->title }}</p>
        </div>
        <div class="card">
            <label>Kategori</label>
            <p>{{ ucfirst($work->category) }} — {{ $work->sub_category ?? '-' }}</p>
        </div>

        @if($work->review_notes)
        <div class="notes">
            <strong>Catatan dari Pembimbing:</strong><br />
            {{ $work->review_notes }}
        </div>
        @endif

        @if($status === 'published')
        <p style="font-size:14px; color:#475569;">Selamat! Karya Anda kini tersedia di halaman portfolio publik Anda.</p>
        @elseif($status === 'revision')
        <p style="font-size:14px; color:#475569;">Silakan lakukan perbaikan sesuai catatan pembimbing, lalu ajukan kembali.</p>
        @endif

        <a href="{{ url('/student/works') }}" class="btn">Lihat Karya Saya →</a>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} PT Saka Inovasi Network. Semua hak dilindungi.
    </div>
</div>
</body>
</html>
