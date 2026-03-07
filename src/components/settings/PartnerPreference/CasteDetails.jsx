import { useEffect, useState } from "react";
import API_URL from "../../../../config";
import { clientAuth } from "../../../../firebase";
import arrowDown from "../../../assets/icons/arrowdown.svg";
import casteNames from "../../../data/casteNames";
import FloatingInput from "../FloatingInput";
import FloatingMultipleSelect from "../FloatingMultipleSelect";
import FloatingSelect from "../FloatingSelect";

function CasteDetails({ casteDetails, setCasteDetails, arrowUp, setIsChanged }) {
  const [show, setShow] = useState(true);

  const [subCasteList, setSubCasteList] = useState([]);

  const getSubCasteData = async () => {
    if (!casteDetails?.caste || casteDetails.caste === "Any") return;
    const token = await clientAuth?.currentUser?.getIdToken();
    try {
      const res = await fetch(`${API_URL}/api/user/subcastes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ caste: casteDetails?.caste }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubCasteList(data);
      }
    }
    catch (error) { }
  }

  useEffect(() => {
    setCasteDetails((prev) => ({
      ...prev,
      subCaste: [],
    }));
    setSubCasteList([]);
    getSubCasteData();
  }, [casteDetails?.caste]);

  return (
    <div className="partner-preference-section">
      <p>
        Caste & Subcaste{" "}
        <img
          onClick={() => setShow(!show)}
          src={show ? arrowUp : arrowDown}
          alt="dropdown arrow"
        />
      </p>
      {show && (
        <div className="input-group">
          <FloatingInput
            placeholder="Religion (Cannot be changed)"
            value={"Hindu"}
            disabled={true}
          />
          <FloatingSelect
            label="Caste"
            value={casteDetails.caste}
            onChange={(value) => {
              setIsChanged(true);
              setCasteDetails({ ...casteDetails, caste: value, subCaste: [] })
            }}
            options={["Any", ...casteNames]}
          />
          {casteDetails.caste && casteDetails.caste !== "Any" && (
            <FloatingMultipleSelect
              placeholder="SubCaste"
              value={casteDetails.subCaste}
              onChange={(value) => {
                setCasteDetails({ ...casteDetails, subCaste: value })
                setIsChanged(true);
              }}
              options={subCasteList}
              allowCustomInput={true}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default CasteDetails;
