import React, { useEffect, useState } from 'react';

type Job = {
  id: number;
  company: string;
  logo: string;
  new: boolean;
  featured: boolean;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  tools: string[];
};

const Jobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [roleFilter, setRoleFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [toolFilter, setToolFilter] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/staterfile/data.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Job[] = await response.json();
        setJobs(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filtering logic
  const filteredJobs = jobs.filter(job => {
    const matchesRole = roleFilter ? job.role === roleFilter : true;
    const matchesLanguage = languageFilter
      ? job.languages.includes(languageFilter)
      : true;
    const matchesTool = toolFilter
      ? job.tools.includes(toolFilter)
      : true;
    return matchesRole && matchesLanguage && matchesTool;
  });

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">Error: {error}</div>;

  // Collect unique filter options
  const roles = Array.from(new Set(jobs.map(job => job.role)));
  const languages = Array.from(new Set(jobs.flatMap(job => job.languages)));
  const tools = Array.from(new Set(jobs.flatMap(job => job.tools)));

  return (
    <div className="bg-cyan-50 ">
        <div style={{ backgroundColor: 'hsl(180, 8%, 52%)' }}>
        <img className="w-screen h-xl" src="/staterfile/images/bg-header-desktop.svg" alt="" />
    </div>
      {/* Filter Bar */}
      <div className="w-max mx-auto mb-8 flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow  justify-center">
        <div>
          <label className="mr-2 font-semibold">Role:</label>
          <select
            className="border rounded px-2 py-1"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Language:</label>
          <select
            className="border rounded px-2 py-1"
            value={languageFilter}
            onChange={e => setLanguageFilter(e.target.value)}
          >
            <option value="">All</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2 font-semibold">Tool:</label>
          <select
            className="border rounded px-2 py-1"
            value={toolFilter}
            onChange={e => setToolFilter(e.target.value)}
          >
            <option value="">All</option>
            {tools.map(tool => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>
        </div>
        {(roleFilter || languageFilter || toolFilter) && (
          <button
            className="ml-auto text-cyan-700 underline"
            onClick={() => {
              setRoleFilter('');
              setLanguageFilter('');
              setToolFilter('');
            }}
          >
            <img className='bg-cyan-200 h-6 w-6' src="/staterfile/images/clear-svgrepo-com.svg" alt="" />
          </button>
        )}
      </div>

      {/* Job Cards */}
      <div className="w-5xl mx-auto flex flex-col gap-6 mt-9">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className={`bg-white rounded-lg shadow flex flex-col md:flex-row items-center p-6 border-l-4 ${
              job.featured ? 'border-cyan-800' : 'border-transparent'
            }`}
          >
            <img
              src={job.logo}
              alt={job.company}
              className="w-20 h-20 md:mr-6 mb-4 md:mb-0 rounded-full bg-gray-100 object-contain"
            />
            <div className="flex-1 w-full">
              <div className="flex items-center gap-4 mb-2">
                <span className="font-bold text-cyan-800">{job.company}</span>
                {job.new && (
                  <span className="bg-cyan-800 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                    New!
                  </span>
                )}
                {job.featured && (
                  <span className="bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded-full uppercase">
                    Featured
                  </span>
                )}
              </div>
              <div className="text-xl font-bold mb-1">{job.position}</div>
              <div className="text-gray-500 text-sm mb-4">
                {job.postedAt} &bull; {job.contract} &bull; {job.location}
              </div>
            </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-cyan-100 text-cyan-800 font-semibold px-2 py-1 rounded">{job.role}</span>
                <span className="bg-cyan-100 text-cyan-800 font-semibold px-2 py-1 rounded">{job.level}</span>
                {job.languages.map(lang => (
                  <span key={lang} className="bg-cyan-100 text-cyan-800 font-semibold px-2 py-1 rounded">{lang}</span>
                ))}
                {job.tools.map(tool => (
                  <span key={tool} className="bg-cyan-100 text-cyan-800 font-semibold px-2 py-1 rounded">{tool}</span>
                ))}
              </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Jobs;