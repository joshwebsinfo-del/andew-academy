import { useState, useEffect } from "react";
import { Users, ShieldCheck, Mail, Database, Search } from "lucide-react";

export default function AdminDesk() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = () => {
      const storedUsersJson = localStorage.getItem("andrew_academy_users_v1") || "[]";
      try {
        const storedUsers = JSON.parse(storedUsersJson);
        setUsers(storedUsers);
      } catch (e) {
        console.error("Failed to parse users", e);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left animate-fadeIn max-w-4xl mx-auto" id="admin-dashboard">
      <div className="bg-gradient-to-r from-slate-900 to-[#0e1154] p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-2xl font-black text-white tracking-tight">Admin Console</h2>
            </div>
            <p className="text-slate-300 text-sm max-w-xl">
              System overview of registered metallurgical operator students and faculty members.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-xl p-4 border border-white/10 backdrop-blur-sm min-w-48 text-center">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest block mb-1">Total Users</span>
            <span className="text-3xl font-black text-white">{users.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-base font-black text-[#0e1154] uppercase tracking-wider flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Registered Accounts
          </h3>
          
          <div className="relative max-w-xs w-full">
            <input 
              type="text" 
              placeholder="Search by name, ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-2 px-3 pl-9 text-xs outline-none transition-all"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Account Holder</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Email Contact</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">ZNQF ID</th>
                <th className="py-3 px-4 text-[10px] font-black uppercase text-slate-500 tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, idx) => (
                  <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800">{u.name}</td>
                    <td className="py-3 px-4 text-slate-500 flex items-center gap-1.5 text-xs">
                      <Mail className="w-3.5 h-3.5" /> {u.email}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-600 font-semibold">{u.studentId}</td>
                    <td className="py-3 px-4">
                      {u.isAdmin ? (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                          Administrator
                        </span>
                      ) : (
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Student
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-xs">
                    <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No registered records matched your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
