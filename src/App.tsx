import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from './layouts/AdminLayout';
import { DepartmentList } from './pages/department/DepartmentList';
import { DutyCalendar } from './pages/duty/DutyCalendar';
import { EmployeeDetail } from './pages/employee/EmployeeDetail';
import { EmployeeForm } from './pages/employee/EmployeeForm';
import { EmployeeList } from './pages/employee/EmployeeList';
import { PositionList } from './pages/position/PositionList';
import { ProjectList } from './pages/project/ProjectList';
import { SystemImport } from './pages/system/SystemImport';
import { SystemLog } from './pages/system/SystemLog';
import { TagList } from './pages/tag/TagList';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/employee/list" replace />} />
        <Route path="employee/list" element={<EmployeeList />} />
        <Route path="employee/detail/:id" element={<EmployeeDetail />} />
        <Route path="employee/form" element={<EmployeeForm />} />
        <Route path="employee/form/:id" element={<EmployeeForm />} />
        <Route path="department/list" element={<DepartmentList />} />
        <Route path="position/list" element={<PositionList />} />
        <Route path="project/list" element={<ProjectList />} />
        <Route path="duty/calendar" element={<DutyCalendar />} />
        <Route path="tag/skill" element={<TagList mode="skill" />} />
        <Route path="tag/interest" element={<TagList mode="interest" />} />
        <Route path="tag/group" element={<TagList mode="group" />} />
        <Route path="system/log" element={<SystemLog />} />
        <Route path="system/import" element={<SystemImport />} />
      </Route>
    </Routes>
  );
}
