import io

import soundfile as sf

FORMATS = {
    "WAV": ("audio/wav", "WAV", "PCM_16"),
    "MP3": ("audio/mpeg", "MP3", "MPEG_LAYER_III"),
    "FLAC": ("audio/flac", "FLAC", "PCM_16"),
}


class AudioError(ValueError):
    pass


def sniff_format(data):
    if len(data) < 12:
        return None
    if data[:4] == b"RIFF" and data[8:12] == b"WAVE":
        return "WAV"
    if data[:4] == b"fLaC":
        return "FLAC"
    if data[:3] == b"ID3" or (data[0] == 0xFF and (data[1] & 0xE0) == 0xE0):
        return "MP3"
    return None


def inspect(data):
    fmt = sniff_format(data)
    if fmt is None:
        raise AudioError("Nepodržani format. Dopušteni su WAV, MP3 i FLAC.")
    try:
        info = sf.info(io.BytesIO(data))
    except Exception as exc:
        raise AudioError(f"Datoteka izgleda kao {fmt}, ali se ne može pročitati.") from exc
    return {
        "format": fmt,
        "duration_sec": round(info.duration, 3) if info.duration else None,
        "sample_rate": info.samplerate,
        "channels": info.channels,
    }


def mime_type(fmt):
    return FORMATS[fmt][0]
