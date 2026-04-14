"""
HotelPro — Telegram Notification Engine
Sends formatted alerts to a configured Telegram chat via Bot API.
Settings (bot_token, chat_id) are read dynamically from the database.
"""
import logging
import urllib.request
import urllib.parse
import json

from sqlalchemy.orm import Session
import models

logger = logging.getLogger("hotelpro.telegram")


def _get_telegram_settings(db: Session) -> tuple[str | None, str | None]:
    """Read telegram_bot_token and telegram_chat_id from Settings table."""
    token_row = db.query(models.Setting).filter(models.Setting.key == "telegram_bot_token").first()
    chat_row = db.query(models.Setting).filter(models.Setting.key == "telegram_chat_id").first()

    bot_token = token_row.value_en.strip() if token_row and token_row.value_en else None
    chat_id = chat_row.value_en.strip() if chat_row and chat_row.value_en else None

    return bot_token, chat_id


def send_telegram_message(db: Session, text: str) -> bool:
    """
    Send a message to the configured Telegram chat.
    Returns True on success, False on failure.
    Uses stdlib urllib so no extra dependencies are needed.
    """
    bot_token, chat_id = _get_telegram_settings(db)

    if not bot_token or not chat_id:
        logger.info("Telegram notification skipped — bot_token or chat_id not configured.")
        return False

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = json.dumps({
        "chat_id": chat_id,
        "text": text,
        "parse_mode": "HTML",
    }).encode("utf-8")

    req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"}, method="POST")

    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode())
            if result.get("ok"):
                logger.info("Telegram notification sent successfully.")
                return True
            else:
                logger.warning(f"Telegram API returned ok=false: {result}")
                return False
    except Exception as exc:
        # Never let Telegram errors break the main application flow
        logger.error(f"Telegram notification failed (graceful skip): {exc}")
        return False


def notify_new_application(db: Session, app_data: dict) -> bool:
    """Format and send a new-application alert."""
    text = (
        "🔔 <b>Yangi Ariza / New Application!</b>\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        f"👤 <b>Ism:</b> {app_data.get('fullname', '—')}\n"
        f"📞 <b>Telefon:</b> {app_data.get('phone', '—')}\n"
        f"🏨 <b>Xizmat:</b> {app_data.get('service_type', '—')}\n"
        f"📝 <b>Xabar:</b> {app_data.get('message', '—')}\n"
        "━━━━━━━━━━━━━━━━━━━━\n"
        "📌 <i>HotelPro Admin Panel</i>"
    )
    return send_telegram_message(db, text)


def send_test_message(db: Session) -> bool:
    """Send a test ping to verify the Telegram integration."""
    text = (
        "✅ <b>HotelPro Telegram Integration Test</b>\n\n"
        "Agar siz bu xabarni ko'rayotgan bo'lsangiz, integratsiya muvaffaqiyatli ishlayapti! 🎉\n\n"
        "<i>— HotelPro Notification Engine</i>"
    )
    return send_telegram_message(db, text)
