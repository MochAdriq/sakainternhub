import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { Plus, FolderOpen, ExternalLink, Edit, Trash2, Send, MoreVertical } from 'lucide-react';
import { useState } from 'react';

const STATUS_LABELS = {
    draft:     { label: 'Draft',            cls: 'badge-draft' },
    submitted: { label: 'Menunggu Review',   cls: 'badge-submitted' },
    revision:  { label: 'Perlu Revisi',      cls: 'badge-revision' },
    approved:  { label: 'Disetujui',         cls: 'badge-approved' },
    published: { label: 'Dipublikasikan',    cls: 'badge-published' },
};

const PROJECT_STATUS = {
    planning:    { label: 'Perencanaan', cls: 'badge bg-gray-100 text-gray-600' },
    development: { label: 'Development', cls: 'badge bg-blue-100 text-blue-700' },
    testing:     { label: 'Testing',     cls: 'badge bg-amber-100 text-amber-700' },
    completed:   { label: 'Selesai',     cls: 'badge bg-emerald-100 text-emerald-700' },
};

export default function ProjectsIndex({ projects, internship }) {
    const canEdit = (p) => !['approved', 'published'].includes(p.verification_status);

    return (
        <AppLayout title="Project Portfolio">
            <div className="space-y-5">
                <div className="page-header">
                    <div>
                        <h1 className="page-title">Project Portfolio</h1>
                        <p className="page-subtitle">Kelola semua project PKL Anda</p>
                    </div>
                    {internship && (
                        <Link href="/student/projects/create" className="btn-primary">
                            <Plus size={18} /> Tambah Project
                        </Link>
                    )}
                </div>

                {!internship && (
                    <div className="alert-warning">
                        <FolderOpen size={18} />
                        <p>Anda belum memiliki PKL aktif. Hubungi admin untuk pendaftaran PKL.</p>
                    </div>
                )}

                {projects.data.length === 0 ? (
                    <div className="card card-body text-center py-16">
                        <FolderOpen size={48} className="mx-auto text-gray-200 mb-4" />
                        <h3 className="text-gray-700 font-medium">Belum ada project</h3>
                        <p className="text-gray-400 text-sm mt-1">Tambahkan project PKL Anda untuk memulai portofolio.</p>
                        {internship && (
                            <Link href="/student/projects/create" className="btn-primary btn-sm mt-4 inline-flex">
                                <Plus size={16} /> Tambah Project
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {projects.data.map((project) => {
                            const vs = STATUS_LABELS[project.verification_status] || STATUS_LABELS.draft;
                            const ps = PROJECT_STATUS[project.project_status] || PROJECT_STATUS.planning;
                            return (
                                <div key={project.id} className="card card-hover p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-gray-900">{project.title}</h3>
                                                <span className={vs.cls}>{vs.label}</span>
                                                <span className={ps.cls}>{ps.label}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{project.description}</p>
                                            <div className="flex flex-wrap gap-1.5">
                                                <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded font-medium">{project.role_in_project}</span>
                                                {(project.technologies || []).slice(0, 4).map((t) => (
                                                    <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{t}</span>
                                                ))}
                                                {(project.technologies || []).length > 4 && (
                                                    <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">+{project.technologies.length - 4}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 flex-shrink-0">
                                            {canEdit(project) && (
                                                <>
                                                    {['draft', 'revision'].includes(project.verification_status) && (
                                                        <Link
                                                            href="#"
                                                            as="button"
                                                            className="btn-success btn-sm"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                if (confirm('Submit project untuk review pembimbing?')) {
                                                                    router.patch(`/student/projects/${project.id}/submit`);
                                                                }
                                                            }}
                                                        >
                                                            <Send size={13} /> Submit
                                                        </Link>
                                                    )}
                                                    <Link href={`/student/projects/${project.id}/edit`} className="btn-secondary btn-sm">
                                                        <Edit size={13} />
                                                    </Link>
                                                    <Link
                                                        href={`/student/projects/${project.id}`}
                                                        method="delete"
                                                        as="button"
                                                        className="btn-danger btn-sm"
                                                        onClick={(e) => { if (!confirm('Hapus project ini?')) e.preventDefault(); }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </Link>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {project.review_notes && project.verification_status === 'revision' && (
                                        <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                                            <p className="text-xs font-medium text-red-700 mb-0.5">Catatan Revisi:</p>
                                            <p className="text-sm text-red-600">{project.review_notes}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {projects.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {projects.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${
                                    link.active
                                        ? 'bg-primary-600 text-white border-primary-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
