import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { getAllPets } from "../api/pet";
import { getAllUsers, deleteUser, updateUser } from "../api/users";
import {
  getAllRequests,
  updateRequestStatus,
  getCompletedAdoptions,
} from "../api/requests";
import { useAuth } from "../App";
import { PawPrint, FileText  } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Components
import Header from "../components/Header";
import NavigationTabs from "../components/NavigationTabs";
import OverviewTab from "../components/OverviewTab";
import PetsTab from "../components/PetsTab";
import RequestsTab from "../components/RequestsTab";
import UsersTab from "../components/UsersTab";
import AdoptionsTab from "../components/AdoptionsTab";
import FollowUpModal from "../components/Modales/FollowUpModal";

// Modals
import PetModal from "../components/Modales/PetModal";
import PetDetailsModal from "../components/Modales/PetDetailsModal";
import DeleteConfirmModal from "../components/Modales/DeleteConfirmModal";
import UserModal from "../components/Modales/UserModal";
import UserDetailsModal from "../components/Modales/UserDetailsModal";
import DeleteUserConfirmModal from "../components/Modales/DeleteUserConfirmModal";

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Pets
  const [apiPets, setApiPets] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  //adoptions
  const [completedAdoptions, setCompletedAdoptions] = useState([]);

  // Users
  const [apiUsers, setApiUsers] = useState([]);
  const [apiUsersLoading, setApiUsersLoading] = useState(false);
  const [apiUsersError, setApiUsersError] = useState(null);

  // Requests
  const [adoptionRequests, setAdoptionRequests] = useState([]);
  const [adoptionLoading, setAdoptionLoading] = useState(false);
  const [adoptionError, setAdoptionError] = useState(null);
  const prevRequestCount = useRef(0); // Para detectar nuevas solicitudes

  // Socket.IO
  const socketRef = useRef(null);

  // Modals
  const [showPetModal, setShowPetModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);

  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [followUpPet, setFollowUpPet] = useState(null);
  const [followUpsData, setFollowUpsData] = useState([]); // Aquí irá luego la data real desde la API

  const fetchApiPets = async () => {
    setApiLoading(true);
    try {
      const response = await getAllPets();
      setApiPets(response || []);
    } catch (error) {
      setApiError("Error al cargar las mascotas desde la API");
      setApiPets([]);
    } finally {
      setApiLoading(false);
    }
  };

  const fetchCompletedAdoptions = async () => {
    try {
      const response = await getCompletedAdoptions();
      setCompletedAdoptions(response || []);
      console.log(response);
    } catch (error) {
      console.error("Error al cargar adopciones completadas:", error);
    }
  };

  const fetchApiUsers = async () => {
    setApiUsersLoading(true);
    try {
      const response = await getAllUsers();
      setApiUsers(response || []);
    } catch (error) {
      setApiUsersError("Error al cargar los usuarios desde la API");
      setApiUsers([]);
    } finally {
      setApiUsersLoading(false);
    }
  };

  const handleFollowUp = (pet) => {
    setFollowUpPet(pet);

    // Datos simulados por ahora
    const mockFollowUps = [
      {
        id: 1,
        visitDate: "2025-07-01",
        petIsHealthy: true,
        hasProperNutrition: true,
        showsAffectionBond: true,
        otherPetsAreFriendly: true,
        comments: "La mascota está en excelente estado.",
        images: [
          "https://placekitten.com/300/200",
          "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=300&q=80",
        ],
      },
      {
        id: 2,
        visitDate: "2025-07-15",
        petIsHealthy: true,
        hasProperNutrition: false,
        showsAffectionBond: true,
        otherPetsAreFriendly: false,
        comments: "Se recomienda mejorar la alimentación.",
        images: [
          "https://placedog.net/300/200",
          "https://images.unsplash.com/photo-1601758123927-196d5f3c7607?auto=format&fit=crop&w=300&q=80",
        ],
      },
    ];

    setFollowUpsData(mockFollowUps);
    setShowFollowUpModal(true);
  };

  const fetchAdoptionRequests = async () => {
    setAdoptionLoading(true);
    try {
      const response = await getAllRequests();
      setAdoptionRequests(response || []);
    } catch (error) {
      setAdoptionError("Error al cargar solicitudes de adopción");
    } finally {
      setAdoptionLoading(false);
    }
  };

  const handleUpdateRequestStatus = async (requestId, status, observations) => {
    try {
      await updateRequestStatus(requestId, status, observations);
      await fetchAdoptionRequests();
    } catch (error) {
      console.error("Error al actualizar la solicitud:", error);
      toast.error("No se pudo actualizar la solicitud");
    }
  };

  // Socket.IO: conexión para admins
  useEffect(() => {
  if (!user) return;

  socketRef.current = io("https://petmatch2-0.onrender.com");

socketRef.current.on("connect", () => {
  console.log("🟢 Conectado al socket con ID:", socketRef.current.id);
  socketRef.current.emit("admin_join");
});

  // Evento: nueva solicitud de adopción
  socketRef.current.on("new_adoption_request", (data) => {
    toast.custom((t) => (
      <div
        className={`max-w-sm w-full bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 flex gap-4 transition-all duration-300 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="flex items-start justify-center pt-1">
          <PawPrint className="text-green-600" size={28} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800">
            Nueva solicitud de adopción
          </h4>
          <p className="text-sm text-gray-600 mt-1 leading-snug">
            <span className="font-medium">{data.userName}</span> quiere adoptar a{" "}
            <span className="font-medium">{data.petName}</span>.
          </p>
        </div>
      </div>
    ));
    fetchAdoptionRequests();

    
  });

  // 🆕 Evento: nuevo seguimiento post-adopción
  socketRef.current.on("new_follow_up", (data) => {
    toast.custom((t) => (
      <div
        className={`max-w-sm w-full bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 flex gap-4 transition-all duration-300 ${
          t.visible ? "animate-enter" : "animate-leave"
        }`}
      >
        <div className="flex items-start justify-center pt-1">
          <FileText className="text-blue-600" size={26} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-800">
            Nuevo seguimiento post-adopción
          </h4>
          <p className="text-sm text-gray-600 mt-1 leading-snug">
            {data.userName} ha registrado un seguimiento para{" "}
            <span className="font-medium">{data.petName}</span>.
          </p>
        </div>
      </div>
    ));
    setTimeout(() => {
      navigate(0); // Refresca la vista después de unos segundos
    }, 3000);
  });

  return () => {
    socketRef.current.disconnect();
  };
}, [user]);


  useEffect(() => {
    fetchApiPets();
    fetchAdoptionRequests();
    if (activeTab === "pets") fetchApiPets();
    if (activeTab === "users" && user?.rol !== "empleado") fetchApiUsers();
    if (activeTab === "requests") fetchAdoptionRequests();
    if (activeTab === "adoptions") fetchCompletedAdoptions();
  }, [activeTab, user]);

  const handleCreatePet = () => {
    setSelectedPet(null);
    setShowPetModal(true);
  };

  const handleEditPet = (pet) => {
    setSelectedPet(pet);
    setShowPetModal(true);
  };

  const handleViewPet = (pet) => {
    setSelectedPet(pet);
    setShowDetailsModal(true);
  };

  const handleDeletePet = (pet) => {
    setSelectedPet(pet);
    setShowDeleteModal(true);
  };

  const handlePetSubmit = async () => {
    setShowPetModal(false);
    await fetchApiPets();
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    setSelectedPet(null);
    await fetchApiPets();
  };

  const handleUserSubmit = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      }
      setShowUserModal(false);
      await fetchApiUsers();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleConfirmDeleteUser = async () => {
    try {
      if (selectedUser) {
        await deleteUser(selectedUser.id);
        setSelectedUser(null);
        setShowDeleteUserModal(false);
        await fetchApiUsers();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  if (!user) return <div className="p-4">Cargando usuario...</div>;

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <Header user={user} onLogout={logout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NavigationTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          userRole={user.rol}
        />

        {activeTab === "overview" && (
          <OverviewTab
            pets={apiPets}
            users={apiUsers}
            adoptionRequests={adoptionRequests}
          />
        )}

        {activeTab === "pets" && (
          <PetsTab
            pets={apiPets}
            loading={apiLoading}
            error={apiError}
            onCreatePet={handleCreatePet}
            onEditPet={handleEditPet}
            onViewPet={handleViewPet}
            onDeletePet={handleDeletePet}
            onRefresh={fetchApiPets}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterType={filterType}
            setFilterType={setFilterType}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />
        )}
        {activeTab === "adoptions" && (
          <AdoptionsTab
            adoptions={completedAdoptions}
            onFollowUp={handleFollowUp}
          />
        )}

        {activeTab === "requests" && (
          <RequestsTab
            requests={adoptionRequests}
            loading={adoptionLoading}
            error={adoptionError}
            onUpdateStatus={handleUpdateRequestStatus}
          />
        )}

        {activeTab === "users" && user.rol !== "empleado" && (
          <UsersTab
            users={apiUsers}
            loading={apiUsersLoading}
            error={apiUsersError}
            onRefresh={fetchApiUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedUser={selectedUser}
            setSelectedUser={setSelectedUser}
            showUserModal={showUserModal}
            setShowUserModal={setShowUserModal}
            showUserDetailsModal={showUserDetailsModal}
            setShowUserDetailsModal={setShowUserDetailsModal}
            showDeleteUserModal={showDeleteUserModal}
            setShowDeleteUserModal={setShowDeleteUserModal}
          />
        )}
      </div>

      {/* Modals */}
      <PetModal
        isOpen={showPetModal}
        onClose={() => setShowPetModal(false)}
        onSubmit={handlePetSubmit}
        pet={selectedPet}
        loading={apiLoading}
      />
      <PetDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        pet={selectedPet}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        petId={selectedPet?.id}
        petName={selectedPet?.name || ""}
        onDeleted={handleConfirmDelete}
      />

      <UserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSubmit={handleUserSubmit}
        user={selectedUser}
      />
      <UserDetailsModal
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        user={selectedUser}
      />
      <DeleteUserConfirmModal
        isOpen={showDeleteUserModal}
        onClose={() => setShowDeleteUserModal(false)}
        userName={`${selectedUser?.firstName} ${selectedUser?.lastName}`}
        onConfirm={handleConfirmDeleteUser}
      />

      <FollowUpModal
        isOpen={showFollowUpModal}
        onClose={() => setShowFollowUpModal(false)}
        pet={followUpPet}
        followUps={followUpsData}
      />

      {/* Footer */}
      <footer className="bg-[#1f2937] text-gray-300 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-300">
          © 2025 PetMatch. Todos los derechos reservados. Desarrollado por el
          equipo de PetMatch.
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
