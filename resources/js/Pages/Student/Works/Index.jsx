import AppLayout from '@/Layouts/AppLayout';
import { Link, useForm, router } from '@inertiajs/react';
import { Plus, Upload, ExternalLink, Edit, Trash2, Send, Filter, Image } from 'lucide-react';
import { useState } from 'react';

const CATEGORIES = [
    { value: '', label: 'Semua Kategori' },
    { value: 'software',      label: 'Software',       color: 'bg-blue-100 text-blue-700' },
    { value: 'design',        label: 'Design',         color: 'bg-purple-100 text-purple-700' },
    { value: 'data',          label: 'Data',           color: 'bg-emerald-100 text-emerald-700' },
    { value: 'research',      label: 'Research',       color: 'bg-amber-100 text-amber-700' },
    { value: 'documentation', label: 'Documentation',  color: 'bg-gray-100 text-gray-700' },
    { value: 'other',         label: 'Other',          color: 'bg-pink-100 text-pink-700' },
];

const STATUS_LABELS = {
    draft:     { label: 'Draft',          cls: 'badge-draft' },
    submitted: { label: 'Review',          cls: 'badge-submitted' },
    revision:  { label: 'Revisi',          cls: 'badge-revision' },
    approved:  { label: 'Disetujui',       cls: 'badge-approved' },
    published: { label: 'Dipublikasikan',  cls: 'badge-published' },
};

export default function WorksIndex({ works }) {
    const [activeCategory, setActiveCategory] = useState('');

    const filtered = activeCategory
        ? works.data.filter((w) => w.category === activeCategory)
        : works.data;

    const submitWork = (workId) => {
        if (confirm('Ajukan karya ini untuk review pembimbing?')) {
            router.patch(`/student/works/${workId}/submit`);
        }
    };

    const deleteWork = (workId) => {
        if (confirm('Hapus karya ini? Tindakan tidak dapat dibatalkan.')) {
            router.delete(`/student/works/${workId}`);
        }
    };

    return (
        <AppLayout title="Karya Mahasiswa">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Karya Mahasiswa</h1>
                        <p className="page-subtitle">Upload dan kelola karya Anda selama PKL</p>
                    </div>
                    <Link href="/student/works/create" className="btn-primary">
                        <Plus size={18} /> Upload Karya
                    </Link>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                                activeCategory === cat.value
                                    ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="card card-body text-center py-16">
                        <Upload size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-700 font-medium">Belum ada karya</h3>
                        <p className="text-gray-400 text-sm mt-1">Mulai upload karya pertama Anda.</p>
                        <Link href="/student/works/create" className="btn-primary btn-sm mt-4 inline-flex">
                            <Plus size={16} /> Upload Karya
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((work) => {
                            const catInfo = CATEGORIES.find((c) => c.value === work.category);
                            const statusInfo = STATUS_LABELS[work.verification_status] || STATUS_LABELS.draft;
                            const canEdit = !['approved', 'published'].includes(work.verification_status);

                            return (
                                <div key={work.id} className="card card-hover overflow-hidden">
                                    {/* Thumbnail */}
                                    <div className="h-40 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                                        {work.thumbnail_path ? (
                                            <img src={`/storage/${work.thumbnail_path}`} alt={work.title}
                                                className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Image size={32} className="text-gray-300" />
                                            </div>
                                        )}
                                        <div className="absolute top-2 left-2">
                                            <span className={`badge ${catInfo?.color || 'bg-gray-100 text-gray-600'}`}>
                                                {catInfo?.label || work.category}
                                            </span>
                                        </div>
                                        <div className="absolute top-2 right-2">
                                            <span className={statusInfo.cls}>{statusInfo.label}</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">{work.title}</h3>
                                        {work.sub_category && (
                                            <p className="text-xs text-gray-500 mb-2">{work.sub_category}</p>
                                        )}
                                        {work.technologies && work.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {work.technologies.slice(0, 3).map((t) => (
                                                    <span key={t} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{t}</span>
                                                ))}
                                            </div>
                                        )}

                                        {work.review_notes && work.verification_status === 'revision' && (
                                            <div className="mb-3 p-2 bg-red-50 rounded text-xs text-red-600 border border-red-100">
                                                <strong>Revisi:</strong> {work.review_notes}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1.5 mt-2">
                                            {work.external_link && (
                                                <a href={work.external_link} target="_blank" rel="noopener noreferrer"
                                                    className="btn-ghost btn-sm p-1.5" title="Buka Link">
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                            {canEdit && (
                                                <>
                                                    {['draft', 'revision'].includes(work.verification_status) && (
                                                        <button onClick={() => submitWork(work.id)} className="btn-success btn-sm">
                                                            <Send size={12} /> Submit
                                                        </button>
                                                    )}
                                                    <Link href={`/student/works/${work.id}/edit`} className="btn-secondary btn-sm p-1.5">
                                                        <Edit size={14} />
                                                    </Link>
                                                    <button onClick={() => deleteWork(work.id)} className="btn-danger btn-sm p-1.5">
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {works.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {works.links.map((link, i) => (
                            <Link key={i} href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${
                                    link.active ? 'bg-primary-600 text-white border-primary-600'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 pointer-events-none' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
