<!DOCTYPE html>
<html>
<head>
    <title>Status Project Berubah</title>
</head>
<body>
    <p>Halo, {{ $project->student->name }}!</p>
    
    <p>Status project portofolio Anda yang berjudul <strong>"{{ $project->title }}"</strong> telah diperbarui oleh pembimbing Anda ({{ $mentor->name }}).</p>
    
    <p>Status baru: <strong>{{ strtoupper($project->verification_status) }}</strong></p>
    
    @if($project->review_notes)
    <p><strong>Catatan Pembimbing:</strong></p>
    <blockquote style="border-left: 4px solid #ddd; padding-left: 10px; color: #555;">
        {{ $project->review_notes }}
    </blockquote>
    @endif
    
    <p>Silakan login ke Saka InternHub untuk melihat detail lebih lanjut.</p>
    <p>Terima kasih.</p>
</body>
</html>
