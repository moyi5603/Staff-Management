import { Navigate, Route, Routes } from 'react-router-dom';
import { EmployeeProvider } from './context/EmployeeContext';
import { CertificateCatalogProvider } from './context/CertificateCatalogContext';
import { TagCatalogProvider } from './context/TagCatalogContext';
import { ProjectProvider } from './context/ProjectContext';
import { AdminLayout } from './layouts/AdminLayout';
import { DepartmentList } from './pages/department/DepartmentList';
import { DutyCalendar } from './pages/duty/DutyCalendar';
import { EmployeeDetail } from './pages/employee/EmployeeDetail';
import { EmployeeForm } from './pages/employee/EmployeeForm';
import { EmployeeList } from './pages/employee/EmployeeList';
import { PositionList } from './pages/position/PositionList';
import { ProjectList } from './pages/project/ProjectList';
import { CertificateCatalogList } from './pages/certificate/CertificateCatalogList';
import { TagCatalogList } from './pages/tag/TagCatalogList';
import { AppProfile } from './pages/app/AppProfile';

export default function App() {
  return (
    <CertificateCatalogProvider>
      <TagCatalogProvider>
        <EmployeeProvider>
          <ProjectProvider>
            <Routes>
              <Route path="app/profile" element={<AppProfile />} />
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
                <Route path="certificate/list" element={<CertificateCatalogList />} />
                <Route path="tag/skill" element={<TagCatalogList mode="skill" />} />
                <Route path="tag/interest" element={<TagCatalogList mode="interest" />} />
                <Route path="system/*" element={<Navigate to="/employee/list" replace />} />
              </Route>
            </Routes>
          </ProjectProvider>
        </EmployeeProvider>
      </TagCatalogProvider>
    </CertificateCatalogProvider>
  );
}
