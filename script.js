document.addEventListener("DOMContentLoaded", () => {
  const containerImg = document.querySelector(".containerImg");
  const fileInput = document.getElementById("fileInput");
  const descricao = document.getElementById("descricao");
  const enviarBtn = document.querySelector("button[type='submit']"); 

  let base64String = ""; 

  const showLoading = () => {
    descricao.value = "Carregando..."; 
    descricao.style.color = "#888"; 
};
  const hideLoading = () => {
    descricao.style.color = "";
};

  const handleFile = (file) => {
      const reader = new FileReader();

      reader.onload = (e) => {
          containerImg.innerHTML = "";
          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.width = "100%";
          img.style.height = "100%";
          img.style.objectFit = "contain";
          containerImg.appendChild(img);

          base64String = e.target.result; 
      };

      reader.readAsDataURL(file);
  };

  containerImg.addEventListener("click", () => {
      fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) handleFile(file);
  });

  enviarBtn.addEventListener("click", (event) => {
    event.preventDefault();

    if (!base64String) {
        alert("Por favor, insira uma imagem.");
        return;
    }

    showLoading();

    fetch("https://1d12-35-236-251-95.ngrok-free.app/process-image", { //mudar a url sempre que rodar o backend
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64String }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Erro na resposta do servidor: ' + response.statusText);
        }
        return response.json();
    })
    .then((data) => {
        console.log("Resposta do servidor:", data); 
        if (data.description) {  
            descricao.value = data.description;
        } else {
            alert("Erro no servidor: " + JSON.stringify(data));
        }
    })
    .catch((error) => {
        console.error("Erro:", error);
        alert("Erro ao conectar ao servidor.");
    })
    .finally(() => {
        hideLoading(); 
    });
});
});
