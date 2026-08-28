import AppLayout from '@/Layouts/AppLayout';
import { useForm, Link } from '@inertiajs/react';
import { ArrowLeft, Upload, Plus, X, Link as LinkIcon } from 'lucide-react';
import { useState, useRef } from 'react';

const CATEGORIES = [
    { value: 'software',       label: 'Software',        subs: ['Website', 'Mobile Application', 'Desktop Application', 'Sistem Informasi'] },
    { value: 'design',         label: 'Design',          subs: ['UI/UX Design', 'Graphic Design', 'Prototype', 'Branding'] },
    { value: 'data',           label: 'Data',            subs: ['Dashboard', 'Data Analysis', 'Data Visualization', 'Report'] },
    { value: 'research',       label: 'Research',        subs: ['Research Paper', 'Article', 'Case Study', 'Survey'] },
    { value: 'documentation',  label: 'Documentation',   subs: ['Technical Documentation', 'User Manual', 'SOP', 'API Docs'] },
    { value: 'other',          label: 'Other',           subs: ['Digital Content', 'Video', 'Presentation', 'Innovation'] },
];

const COMMON_TECHS = ['Laravel', 'React', 'Vue.js', 'Node.js', 'Python', 'PHP', 'JavaScript',
    'MySQL', 'Figma', 'Adobe XD', 'Photoshop', 'TailwindCSS', 'Bootstrap', 'Flutter', 'Excel', 'Power BI', 'Tableau'];

export default function WorkForm({ work, internship, projects }) {
    const isEditing = !!work;
    const [filePreview, setFilePreview] = useState(null);
    const [thumbPreview, setThumbPreview] = useState(work?.thumbnail_path ? `/storage/${work.thumbnail_path}` : null);
    const [techInput, setTechInput] = useState('');
    const fileRef = useRef();
    const thumbRef = useRef();

    const selectedCat = CATEGORIES.find((c) => c.value === (work?.category || ''));

    const { data, setData, post, processing, errors } = useForm({
        internship_id:   work?.internship_id || internship?.id || '',
        project_id:      work?.project_id || '',
        title:           work?.title || '',
        description:     work?.description || '',
        category:        work?.category || '',
        sub_category:    work?.sub_category || '',
        external_link:   work?.external_link || '',
        technologies:    work?.technologies || [],
        is_confidential: work?.is_confidential || false,
        file:            null,
        thumbnail:       null,
        _method:         isEditing ? 'PATCH' : 'POST',
    });

    const currentCat = CATEGORIES.find((c) => c.value === data.category);

    const addTech = (tech) => {
        if (tech && !data.technologies.includes(tech)) setData('technologies', [...data.technologies, tech]);
        setTechInput('');
    };

    const submit = (e) => {
        e.preventDefault();
        const url = isEditing ? `/student/works/${work.id}` : '/student/works';
        post(url, { forceFormData: true });
    };

    return (
        <AppLayout title={isEditing ? 'Edit Karya' : 'Upload Karya'}>
            <div className="max-w-2xl mx-auto">
                <div className="page-header">
                    <div className="flex items-center gap-3">
                        <Link href="/student/works" className="btn-ghost btn-sm p-2"><ArrowLeft size={18} /></Link>
                        <div>
                            <h1 className="page-title">{isEditing ? 'Edit Karya' : 'Upload Karya Baru'}</h1>
                            <p className="page-subtitle">Dokumentasikan karya terbaik Anda</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6" encType="multipart/form-data">
                    <div className="card card-body space-y-5">
                        {/* Title */}
                        <div className="form-group">
                            <label className="form-label">Judul Karya *</label>
                            <input type="text" className={`form-input ${errors.title ? 'border-red-500' : ''}`}
                                value={data.title} onChange={(e) => setData('title', e.target.value)}
                                placeholder="Judul karya Anda" required />
                            {errors.title && <p className="form-error">{errors.title}</p>}
                        </div>

                        {/* Category */}
                        <div className="form-group">
                            <label className="form-label">Kategori *</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {CATEGORIES.map((cat) => (
                                    <button key={cat.value} type="button"
                                        onClick={() => { setData('category', cat.value); setData('sub_category', ''); }}
                                        className={`py-2 px-3 text-sm rounded-lg border-2 transition-all font-medium text-left ${
                                            data.category === cat.value
                                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                        }`}>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                            {errors.category && <p className="form-error">{errors.category}</p>}
                        </div>

                        {/* Sub category */}
                        {currentCat && (
                            <div className="form-group">
                                <label className="form-label">Sub Kategori</label>
                                <select className="form-select" value={data.sub_category}
                                    onChange={(e) => setData('sub_category', e.target.value)}>
                                    <option value="">-- Pilih Sub Kategori --</option>
                                    {currentCat.subs.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Description */}
                        <div className="form-group">
                            <label className="form-label">Deskripsi</label>
                            <textarea className="form-textarea" rows={3} value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan karya Anda secara singkat..." />
                        </div>

                        {/* Link to project */}
                        {projects.length > 0 && (
                            <div className="form-group">
                                <label className="form-label">Kaitkan dengan Project (opsional)</label>
                                <select className="form-select" value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}>
                                    <option value="">-- Tidak dikaitkan --</option>
                                    {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                            </div>
                        )}

                        {/* File Upload */}
                        <div className="form-group">
                            <label className="form-label">File Karya (maks. 20MB)</label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors cursor-pointer"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">
                                    {data.file ? data.file.name : (work?.file_original_name || 'Klik untuk upload file')}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">PDF, DOC, ZIP, gambar, video, dll.</p>
                                <input ref={fileRef} type="file" className="hidden"
                                    onChange={(e) => setData('file', e.target.files[0])} />
                            </div>
                        </div>

                        {/* Thumbnail */}
                        <div className="form-group">
                            <label className="form-label">Thumbnail / Cover (opsional, maks. 5MB)</label>
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-primary-400 transition-colors flex items-center justify-center bg-gray-50"
                                    onClick={() => thumbRef.current?.click()}
                                >
                                    {thumbPreview ? (
                                        <img src={thumbPreview} className="w-full h-full object-cover" alt="Thumbnail" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload size={18} className="mx-auto text-gray-400" />
                                            <p className="text-[10px] text-gray-400 mt-1">Upload gambar</p>
                                        </div>
                                    )}
                                </div>
                                <input ref={thumbRef} type="file" accept="image/*" className="hidden"
                                    onChange={(e) => {
                                        const f = e.target.files[0];
                                        if (f) { setData('thumbnail', f); setThumbPreview(URL.createObjectURL(f)); }
                                    }} />
                                <p className="text-xs text-gray-500 mt-2">Gambar yang ditampilkan di halaman portofolio publik</p>
                            </div>
                        </div>

                        {/* External Link */}
                        <div className="form-group">
                            <label className="form-label flex items-center gap-1.5"><LinkIcon size={14} /> Link Demo / GitHub / Figma (opsional)</label>
                            <input type="url" className={`form-input ${errors.external_link ? 'border-red-500' : ''}`}
                                value={data.external_link} onChange={(e) => setData('external_link', e.target.value)}
                                placeholder="https://..." />
                            {errors.external_link && <p className="form-error">{errors.external_link}</p>}
                        </div>

                        {/* Technologies */}
                        <div className="form-group">
                            <label className="form-label">Teknologi yang Digunakan</label>
                            <div className="flex flex-wrap gap-1.5 mb-2">
                                {data.technologies.map((t) => (
                                    <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                                        {t} <button type="button" onClick={() => setData('technologies', data.technologies.filter((x) => x !== t))}><X size={11} /></button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2 mb-2">
                                <input type="text" className="form-input flex-1" placeholder="Tambah teknologi..."
                                    value={techInput} onChange={(e) => setTechInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTech(techInput.trim()); } }} />
                                <button type="button" onClick={() => addTech(techInput.trim())} className="btn-secondary btn-sm"><Plus size={14} /></button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {COMMON_TECHS.filter((t) => !data.technologies.includes(t)).map((t) => (
                                    <button key={t} type="button" onClick={() => addTech(t)}
                                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-primary-100 hover:text-primary-700 text-gray-600 rounded-full transition-colors">
                                        + {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Confidential */}
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                checked={data.is_confidential}
                                onChange={(e) => setData('is_confidential', e.target.checked)} />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Karya Rahasia</p>
                                <p className="text-xs text-gray-500">Tidak ditampilkan di halaman portofolio publik</p>
                            </div>
                        </label>
                    </div>

                    <div className="flex justify-between gap-3">
                        <Link href="/student/works" className="btn-secondary btn-lg">Batal</Link>
                        <button type="submit" disabled={processing} className="btn-primary btn-lg">
                            {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Upload Karya')}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
