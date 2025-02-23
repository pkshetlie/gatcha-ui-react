import React, {useEffect, useState} from "react";
import {useGame} from "../../context/GameContext";
import api from "../../services/api"; // Service d'API
import config from "../../config";
import CardReveal from "../Card/CardReveal"; // Composant de révélation des cartes
import "./Shop.css"; // Import des styles

const Shop = () => {
  const { inventory } = useGame(); // Récupération de l'état de l'inventaire
  const [summons, setSummons] = useState([]); // Liste des invocations disponibles
  const [error, setError] = useState(null); // Gestion des erreurs
  const [loading, setLoading] = useState(true); // Loader pour l'état de chargement
  const [invokedCards, setInvokedCards] = useState([]); // Stocke les cartes invoquées
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const token = localStorage.getItem("token");
  const refreshToken = localStorage.getItem("refreshToken");

  const getIconUrl = (iconName) =>
    `${config.INVENTORY_IMAGE_BASE_URL}/${iconName}.png`;

  const getInventoryCount = (costTypeEnumName) => {
    if (!Array.isArray(inventory)) {
      return 0; // Renvoie 0 si `inventory` n'est pas un tableau
    }

    const item = inventory.find((item) => item.enum.name === costTypeEnumName);
    return item ? parseInt(item.count, 10) : 0;
  };


  const canPurchase = (costTypeEnumName, cost) =>
    getInventoryCount(costTypeEnumName) >= cost;

  useEffect(() => {
    const fetchSummons = async () => {
      try {
        const data = await api.get('/summons', token, refreshToken); // Appels gérés avec le service API
        setSummons(data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors de la récupération des invocations :', err);
        setError('Une erreur est survenue. Veuillez réessayer.');
        setLoading(false);
      }
    };
    fetchSummons();
  }, [token, refreshToken]);

  // Fonction pour gérer l'invocation d'assistants
  const handleInvocation = async (summonId, amount) => {
    try {
      handleOpenModal();
      const response = await api.post(
        `/summon/${summonId}?buy=${amount}`,
        null,
        token,
        refreshToken
      );
      // JSON des assistants invoqués
      setInvokedCards(response); // Stocke les cartes invoquées pour les afficher
    } catch (err) {
      console.error("Erreur pendant l'invocation :", err);
      setError("Impossible d'invoquer. Veuillez réessayer.");
    }
  };

  if (loading) return <div className="shop-loader">Chargement...</div>;
  if (error) return <div className="shop-error">{error}</div>;

  return (
    <div className="shop">
      <div className="summons-container">
        {summons.map((summon) => {
          const availableCount = getInventoryCount(summon.costTypeEnum.name);
          const iconUrl = getIconUrl(summon.costTypeEnum.name);

          return (
            <div key={summon.id} className="summon-card">
              <img
                className="summon-banner"
                src={`${config.BASE_URL}/summon/${summon.banner}`}
                alt={`Bannière ${summon.label}`}
              />
              <h3 className="summon-title">{summon.label}</h3>
              <p className="summon-inventory">
                Ressources disponibles : {availableCount}
              </p>
              <p className="summon-options">Choisissez une option :</p>
              <div className="summon-buttons">
                {[1, 6, 12].map((amount) => (
                  <button
                    key={amount}
                    className={`summon-button ${
                      !canPurchase(summon.costTypeEnum.name, amount)
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handleInvocation(summon.id, amount)}
                    disabled={!canPurchase(summon.costTypeEnum.name, amount)}
                  >
                    x{amount}
                    <img className="summon-cost-icon" src={iconUrl} alt="" />
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {showModal && <CardReveal
        cards={invokedCards}
        closeModal={handleCloseModal}
        backCardImage={config.IMAGE_BASE_URL+`imgs/back-card/space.jpg` }
      />}
    </div>
  );
};

export default Shop;
