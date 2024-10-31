import { teamMemberStore } from "./store.js";
const baseURL = "http://localhost:5500";

// Fetch and display team members
export async function fetchAndDisplayTeamMembers() {
  const teamTableBody = document.getElementById("team-table-body");
  teamTableBody.innerHTML = "";

  try {
    const response = await fetch(`${baseURL}/api/teamMembers`);
    if (!response.ok)
      throw new Error(`Error: ${response.status} ${response.statusText}`);

    const data = await response.json();
    const teamMembers = data.teamMembers || []; // Ensure it's an array

    teamMembers.forEach((member, index) => {
      teamMemberStore[member._id] = member;

      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${member.name}</td>
          <td>${member.role}</td>
          <td><img src="${member.image}" alt="${
        member.name
      }" width="100" /></td>
          <td>${member.bio || ""}</td>
          <td>
            <button class="btn btn-secondary" onclick="openTeamMemberModal('${
              member._id
            }')">Edit</button>
            <button class="btn btn-danger" onclick="deleteTeamMember('${
              member._id
            }')">Delete</button>
          </td>
        </tr>
      `;
      teamTableBody.insertAdjacentHTML("beforeend", row);
    });
  } catch (error) {
    console.error("Failed to fetch team members", error);
    teamTableBody.innerHTML = `<tr><td colspan="6">Failed to load team members: ${error.message}</td></tr>`;
  }
}

// Event listeners for team members
export function attachTeamMemberListeners() {
  const teamForm = document.getElementById("team-member-form");
  if (teamForm) {
    teamForm.addEventListener("submit", saveTeamMember);
  }
}

// Open team member modal
window.openTeamMemberModal = (memberId) => {
  const member = teamMemberStore[memberId];
  openModal("team-member-modal", "Edit Team Member", member, memberId);
};

// Close team member modal
window.closeTeamMemberModal = () => closeModal("team-member-modal");

// Save team member (add or edit)
async function saveTeamMember(event) {
  event.preventDefault();

  const imageFileInput = document.getElementById("team-member-image-file");
  let imageUrl = document.getElementById("team-member-image").value;

  if (imageFileInput.files.length > 0) {
    const imageFile = imageFileInput.files[0];
    imageUrl = await uploadImage(imageFile);
  }

  const teamMemberData = {
    name: document.getElementById("team-member-name").value,
    role: document.getElementById("team-member-role").value,
    bio: document.getElementById("team-member-bio").value || "",
    image: imageUrl,
  };

  const url = editingTeamMemberId
    ? `${baseURL}/api/teamMembers/${editingTeamMemberId}`
    : `${baseURL}/api/teamMembers`;
  const method = editingTeamMemberId ? "PUT" : "POST";

  await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(teamMemberData),
  });

  closeTeamMemberModal();
  fetchAndDisplayTeamMembers(); // Refresh the list
}

// Delete team member
export async function deleteTeamMember(memberId) {
  if (confirm("Are you sure you want to delete this team member?")) {
    try {
      await fetch(`${baseURL}/api/teamMembers/${memberId}`, {
        method: "DELETE",
      });
      fetchAndDisplayTeamMembers();
    } catch (error) {
      console.error("Failed to delete team member", error);
    }
  }
}
