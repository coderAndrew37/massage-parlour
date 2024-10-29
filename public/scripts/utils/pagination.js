// src/utils/pagination.js
export function renderPaginationControls(
  currentPage,
  totalPages,
  section,
  renderCallback
) {
  const paginationContainer = document.querySelector(
    `.${section}-pagination-container`
  );
  if (!paginationContainer) return;

  let paginationHTML = `<ul class="pagination">`;

  paginationHTML +=
    currentPage === 1
      ? `<li class="disabled"><a>Previous</a></li>`
      : `<li><a href="#" data-page="${currentPage - 1}">Previous</a></li>`;

  for (let page = 1; page <= totalPages; page++) {
    paginationHTML +=
      page === currentPage
        ? `<li class="active"><a>${page}</a></li>`
        : `<li><a href="#" data-page="${page}">${page}</a></li>`;
  }

  paginationHTML +=
    currentPage === totalPages
      ? `<li class="disabled"><a>Next</a></li>`
      : `<li><a href="#" data-page="${currentPage + 1}">Next</a></li>`;

  paginationHTML += `</ul>`;
  paginationContainer.innerHTML = paginationHTML;

  paginationContainer.querySelectorAll(".page-link").forEach((link) =>
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = parseInt(e.target.getAttribute("data-page"));
      renderCallback(page);
    })
  );
}
