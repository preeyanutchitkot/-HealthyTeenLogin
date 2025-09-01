import { useState } from "react";
import Image from "next/image";

export default function AddFoodSheet({
  customFoods,
  setCustomFoods,
  onAddCustom,
  onSave,
  onClose,
}) {
  const [foodInputs, setFoodInputs] = useState([{ name: "", calories: 350 }]);

  const handleAddInput = () => {
    setFoodInputs([...foodInputs, { name: "", calories: 350 }]);
  };

  const handleRemoveInput = (index) => {
    const newFoodInputs = [...foodInputs];
    newFoodInputs.splice(index, 1);
    setFoodInputs(newFoodInputs);
  };

  const handleInputChange = (index, field, value) => {
    const newFoodInputs = [...foodInputs];
    newFoodInputs[index][field] = value;
    setFoodInputs(newFoodInputs);
  };

  const handleSave = () => {
    foodInputs.forEach((food) => {
      const name = food.name.trim();
      const cal = Number(food.calories) || 0;
      if (name && cal > 0) {
        onAddCustom({
          id: Date.now(),
          name,
          calories: cal,
          image: "/foods/custom.png",  // Or provide default image for custom foods
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
              <div className="input-field-wrapper">
                <input
                  type="text"
                  placeholder="เพิ่มเมนูของคุณ"
                  value={food.name}
                  onChange={(e) => handleInputChange(index, "name", e.target.value)}
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
                <button className="add-btn" onClick={handleAddInput}>
                  +
                </button>
              ) : (
                <button className="trash-btn" onClick={() => handleRemoveInput(index)}>
                  <Image src="/trash.png" alt="ลบ" width={16} height={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="sheet-footer">
          <button className="save" onClick={handleSave} disabled={foodInputs.length === 0}>
            บันทึก
          </button>
        </div>




        {/* สไตล์เฉพาะของ AddFoodSheet */}
        <style jsx>{`
          .item-wrapper {
            display: flex;
            align-items: center;
            gap: 10px;
            margin: 8px 12px 16px;
          }
          .input-field-wrapper {
            display: flex;
            flex-direction: row;
            flex: 1;
            gap: 8px;
          }
          .input-field-wrapper input {
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            font-size: 14px;
            background: #ffffff;
          }
          .food-input {
            flex: 3;
          }
          .cal-input {
            flex: 1;
            width: 100px;
          }

          .add-btn {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            border: none;
            background: #3abb47;
            color: #fff;
            font-size: 22px;
            display: grid;
            place-items: center;
            cursor: pointer;
          }

          .trash-btn {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #ffffff;
            border: none;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
            display: grid;
            place-items: center;
          }

          .save {
            width: 100%;
            padding: 12px;
            background: #3abb47;
            border: none;
            color: white;
            font-size: 16px;
            border-radius: 12px;
            cursor: pointer;
          }
        `}</style>
      </div>
    </div>
  );
}
