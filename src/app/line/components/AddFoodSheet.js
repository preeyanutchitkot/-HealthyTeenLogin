import { useState } from "react";
import Image from "next/image";
import { pickImageByName } from "../lib/pickImageByName";

export default function AddFoodSheet({ onAddCustom, onSave, onClose }) {

  const [foodInputs, setFoodInputs] = useState([{ name: "", calories: "" }]);
  const [apiResults, setApiResults] = useState([""]);
  const [loadingRows, setLoadingRows] = useState([false]);

  const handleAddInput = () => {
    setFoodInputs((prev) => [...prev, { name: "", calories: "" }]);
    setApiResults((prev) => [...prev, ""]);
    setLoadingRows((prev) => [...prev, false]);
  };

  const handleRemoveInput = (index) => {
    setFoodInputs((prev) => prev.filter((_, i) => i !== index));
    setApiResults((prev) => prev.filter((_, i) => i !== index));
    setLoadingRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputBlur = async (index, value) => {
    const v = value.trim();
    if (!v) return;

    setLoadingRows((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    try {
      const n8nApiUrl = "/api/calories";

      const res = await fetch(n8nApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foodName: v }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      const resultStr = JSON.stringify(data, null, 2);
      setApiResults((prev) => {
        const next = [...prev];
        next[index] = resultStr;
        return next;
      });

      const caloriesString = data.calories || "";
      const newCalories = parseInt(caloriesString) || "";
      setFoodInputs((prev) => {
        const next = [...prev];
        next[index].calories = newCalories;
        return next;
      });
    } catch (err) {
      console.error("Failed to fetch calories from n8n:", err);
      setApiResults((prev) => {
        const next = [...prev];
        next[index] = `Error: ${err.message}`;
        return next;
      });
    } finally {
      setLoadingRows((prev) => {
        const next = [...prev];
        next[index] = false;
        return next;
      });
    }
  };

  const handleInputChange = (index, field, value) => {
    setFoodInputs((prev) => {
      const next = [...prev];
      next[index][field] = value;
      return next;
    });
  };


  const handleSave = () => {
    foodInputs.forEach((food) => {
      const name = food.name.trim();
      const cal = Number(food.calories) || 0;
      if (name && cal > 0) {
        const image = pickImageByName(name);
        onAddCustom({
          id: Date.now() + Math.random(),
          name,
          calories: cal,
          image,
        });
      }
    });
    onSave();
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <div className="dragbar" />
          <h2 className="title">เพิ่มเมนูของคุณ</h2>
          <button className="close" onClick={onClose} aria-label="ปิด">
            &times;
          </button>
        </div>

        <div className="sheet-list">
          {foodInputs.map((food, index) => (
            <div key={index} className="item-wrapper">
              <div className="input-with-button-wrapper">
                <div className="input-field-wrapper">
                  <input
                    type="text"
                    placeholder="เพิ่มเมนูของคุณ (เช่น ต้มยำ, ผัดกะเพรา, ข้าวราดแกง, ก๋วยเตี๋ยวหมู)"
                    value={food.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    onBlur={(e) => handleInputBlur(index, e.target.value)}
                    className="food-input"
                  />
                  <input
                    type="number"
                    placeholder="แคลอรี่"
                    value={food.calories}
                    onChange={(e) => handleInputChange(index, "calories", e.target.value)}
                    className="cal-input"
                  />
                </div>

                {index === foodInputs.length - 1 ? (
                  <button className="add-btn" onClick={handleAddInput}>+</button>
                ) : (
                  <button className="trash-btn" onClick={() => handleRemoveInput(index)}>
                    <Image src="/trash.png" alt="ลบ" width={16} height={16} />
                  </button>
                )}
              </div>

              {loadingRows[index] ? (
                <div className="result-display">
                  <span className="api-result-text">กำลังวิเคราะห์แคลอรี่…</span>
                </div>
              ) : apiResults[index] ? (
                <div className="result-display">
                  <span className="api-result-text">
                    อาหารของคุณมีจำนวนแคลอรี่ : {apiResults[index]}
                  </span>
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="sheet-footer">
          <button className="save" onClick={handleSave} disabled={foodInputs.length === 0}>
            บันทึก
          </button>
        </div>

        <style jsx>{`
          .item-wrapper { display:flex; flex-direction:column; align-items:flex-start; gap:6px; margin:8px 12px 14px; }
          .input-with-button-wrapper { display:flex; align-items:center; width:100%; gap:10px; }
          .input-field-wrapper { display:flex; flex:1; gap:8px; }
          .input-field-wrapper input { padding:12px; border:1px solid #e5e7eb; border-radius:12px; font-size:14px; background:#fff; box-sizing:border-box; }
          .food-input { flex:3; width:100%; }
          .cal-input { flex:1; width:100px; text-align:center; }
          .add-btn { width:36px; height:36px; border-radius:50%; border:none; background:#3abb47; color:#fff; font-size:22px; display:grid; place-items:center; cursor:pointer; flex-shrink:0; }
          .trash-btn { width:28px; height:28px; border-radius:50%; background:#fff; border:none; box-shadow:0 1px 4px rgba(0,0,0,.08); display:grid; place-items:center; flex-shrink:0; }
          .save { width:100%; padding:12px; background:#3abb47; border:none; color:#fff; font-size:16px; border-radius:12px; cursor:pointer; }
          .result-display { margin:0 4px 0 4px; text-align:left; }
          .api-result-text { font-size:13px; color:#000; font-weight:bold; white-space:pre-wrap; word-break:break-word; }
        `}</style>
      </div>
    </div>
  );
}
